from rest_framework import viewsets, filters, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django.db.models import Sum, Count
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta

from .models import Customer, Mechanic, Booking
from .serializers import CustomerSerializer, MechanicSerializer, BookingSerializer, RegisterSerializer

# --- Authentication ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = RegisterSerializer
    
# --- CRUD ViewSets ---

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MechanicViewSet(viewsets.ModelViewSet):
    queryset = Mechanic.objects.all()
    serializer_class = MechanicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['vehicle', 'service', 'customer__name', 'mechanic__name']
    ordering_fields = ['amount', 'created_at', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        # Ensure we don't filter out everything if the frontend sends "all"
        if status and status.lower() != 'all':
            queryset = queryset.filter(status__iexact=status)
        return queryset

# --- Dashboard API ---

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    today = timezone.now().date()
    seven_days_ago = today - timedelta(days=7)
    
    # 1. Overview Metrics (8 KPIs)
    total_bookings = Booking.objects.count()
    completed_bookings = Booking.objects.filter(status='Completed').count()
    pending_bookings = Booking.objects.filter(status='Pending').count()
    cancelled_bookings = Booking.objects.filter(status='Cancelled').count()
    today_bookings = Booking.objects.filter(created_at__date=today).count()
    
    revenue_aggr = Booking.objects.exclude(status='Cancelled').aggregate(Sum('amount'))
    total_revenue = revenue_aggr['amount__sum'] or 0
    active_mechanics = Mechanic.objects.filter(status__in=['Available', 'Busy']).count()
    
    try:
        new_customers = Customer.objects.filter(created_at__date=today).count()
    except Exception:
        new_customers = Customer.objects.count()

    # 2. Analytics Charts Data (All 4 requested charts)
    status_breakdown = Booking.objects.values('status').annotate(value=Count('id'))
    service_breakdown = Booking.objects.values('service').annotate(value=Count('id'))
    
    revenue_by_day = Booking.objects.filter(
        status='Completed', created_at__date__gte=seven_days_ago
    ).values('created_at__date').annotate(revenue=Sum('amount')).order_by('created_at__date')

    bookings_by_day = Booking.objects.filter(
        created_at__date__gte=seven_days_ago
    ).values('created_at__date').annotate(count=Count('id')).order_by('created_at__date')

    # Format dates for frontend
    formatted_revenue = [
        {'date': item['created_at__date'].strftime('%b %d'), 'revenue': float(item['revenue'])}
        for item in revenue_by_day
    ]
    formatted_bookings = [
        {'date': item['created_at__date'].strftime('%b %d'), 'count': item['count']}
        for item in bookings_by_day
    ]

    # 3. Mechanics Overview (Name, Status, Jobs Completed, Last Booking)
    mechanics_data = []
    for m in Mechanic.objects.all():
        jobs_completed = Booking.objects.filter(mechanic=m, status='Completed').count()
        last_booking = Booking.objects.filter(mechanic=m).order_by('-created_at').first()
        
        last_booking_str = f"{last_booking.vehicle} ({last_booking.status})" if last_booking else "No recent jobs"
        
        mechanics_data.append({
            'id': m.id,
            'name': m.name,
            'status': getattr(m, 'status', 'Available'),
            'jobs_completed': jobs_completed,
            'last_booking': last_booking_str
        })

    return Response({
        'overview': {
            'totalBookings': total_bookings,
            'todaysBookings': today_bookings,
            'completedBookings': completed_bookings,
            'pendingBookings': pending_bookings,
            'cancelledBookings': cancelled_bookings,
            'totalRevenue': float(total_revenue),
            'activeMechanics': active_mechanics,
            'newCustomers': new_customers,
        },
        'charts': {
            'status_breakdown': list(status_breakdown),
            'service_breakdown': list(service_breakdown),
            'revenue_over_time': formatted_revenue,
            'bookings_over_time': formatted_bookings
        },
        'mechanics': mechanics_data
    })