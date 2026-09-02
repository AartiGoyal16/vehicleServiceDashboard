import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Customer, Mechanic, Booking

class Command(BaseCommand):
    help = 'Seeds database with realistic customers, mechanics, and 500+ bookings'

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing old data...")
        Booking.objects.all().delete()
        Mechanic.objects.all().delete()
        Customer.objects.all().delete()

        first_names = ["Amit", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Rohan", "Kavita", "Suresh", "Pooja", "Rajesh", "Deepika", "Manish", "Neha", "Arjun", "Simran", "Karan", "Meera", "Nikhil", "Divya"]
        last_names = ["Sharma", "Verma", "Patel", "Mehta", "Singh", "Kumar", "Gupta", "Reddy", "Joshi", "Chopra", "Nair", "Iyer", "Yadav", "Malhotra", "Kapoor"]

        vehicles = [
            "Hyundai Creta", "Maruti Swift", "Tata Nexon", "Honda City", 
            "Mahindra Thar", "Kia Seltos", "Toyota Fortuner", "Volkswagen Polo", 
            "BMW 3 Series", "Audi A4", "Mercedes C-Class", "MG Hector"
        ]

        services = [
            ("Periodic Engine Oil Service", 2499.00),
            ("Brake Pad Replacement", 1899.00),
            ("Complete AC Gas & Filter Service", 2999.00),
            ("Comprehensive Car Inspection", 999.00),
            ("Battery Jumpstart & Replacement", 3499.00),
            ("Clutch Overhaul & Fluid Flush", 4599.00),
            ("Full Body Detailing & Polishing", 3999.00),
            ("Suspension Bushing & Strut Repair", 5499.00)
        ]

        statuses = [
            "Pending", "Assigned", "Mechanic On The Way", 
            "In Progress", "Completed", "Cancelled"
        ]

        # 1. Create 25 Mechanics
        self.stdout.write("Creating mechanics...")
        mechanics = []
        for i in range(25):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            mechanics.append(Mechanic(
                name=f"{fname} {lname}",
                status=random.choice(["Available", "Busy", "Offline"]),
                jobs_completed=random.randint(10, 150)
            ))
        created_mechanics = Mechanic.objects.bulk_create(mechanics)

        # 2. Create 60 Customers
        self.stdout.write("Creating customers...")
        customers = []
        for i in range(60):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            email = f"{fname.lower()}.{lname.lower()}{i+10}@example.com"
            phone = f"+91 {random.randint(7000000000, 9999999999)}"
            customers.append(Customer(name=f"{fname} {lname}", email=email, phone=phone))
        created_customers = Customer.objects.bulk_create(customers)

        # 3. Create 520 Bookings with Realistic Timestamps
        self.stdout.write("Creating 520 bookings...")
        bookings = []
        now = timezone.now()

        for _ in range(520):
            customer = random.choice(created_customers)
            mechanic = random.choice(created_mechanics)
            service_name, base_amount = random.choice(services)
            vehicle = random.choice(vehicles)
            status = random.choice(statuses)
            
            # Fluctuate price slightly
            amount = base_amount + random.choice([-200, 0, 150, 300, 500])
            
            # Distribute bookings over the last 30 days
            random_days_ago = random.randint(0, 30)
            random_minutes = random.randint(0, 1440)
            created_date = now - timedelta(days=random_days_ago, minutes=random_minutes)

            booking = Booking(
                customer=customer,
                mechanic=mechanic if status != "Pending" else None,
                vehicle=vehicle,
                service=service_name,
                status=status,
                amount=amount,
                created_at=created_date
            )
            bookings.append(booking)

        Booking.objects.bulk_create(bookings)
        self.stdout.write(self.style.SUCCESS("Successfully seeded database with 25 mechanics, 60 customers, and 520 bookings!"))