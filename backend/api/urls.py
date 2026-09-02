from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, MechanicViewSet, BookingViewSet, dashboard_stats, RegisterView

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'mechanics', MechanicViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]