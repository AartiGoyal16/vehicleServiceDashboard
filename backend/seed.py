import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Customer, Mechanic, Booking

def seed_data():
    print("Clearing old data...")
    Booking.objects.all().delete()
    Mechanic.objects.all().delete()
    Customer.objects.all().delete()

    print("Generating Customers...")
    customer_names = ["Aarti Goyal", "Rohan Singh", "Vikram Yadav", "Kavita Gupta", "Simran Singh", "Nikhil Reddy", "Meera Yadav", "Arjun Chopra", "Rahul Yadav", "Neha Malhotra", "Suresh Sharma", "Amit Nair", "Ananya Sharma", "Karan Verma", "Priya Verma"]
    customers = []
    for i in range(50):
        c = Customer.objects.create(
            name=f"{random.choice(customer_names)} {random.randint(1, 100)}",
            email=f"customer{i}@example.com",
            phone=f"98765{random.randint(10000, 99999)}"
        )
        customers.append(c)

    print("Generating Mechanics...")
    mechanic_names = ["Rajesh Kumar", "Vikram Malhotra", "Amit Kumar", "Rohan Joshi", "Sneha Sharma", "Meera Reddy"]
    mechanics = []
    for i in range(20):
        m = Mechanic.objects.create(
            name=f"{random.choice(mechanic_names)} {i}",
            status=random.choice(['Available', 'Busy', 'Offline']) # Removed the phone field!
        )
        mechanics.append(m)

    print("Generating 500+ Bookings...")
    services = [
        "Battery Jumpstart & Replacement", "Brake Pad Replacement", 
        "Clutch Overhaul & Fluid Flush", "Complete AC Gas & Filter Service", 
        "Comprehensive Car Inspection", "Full Body Detailing & Polishing", 
        "Periodic Engine Oil Service", "Suspension Bushing & Strut Repair"
    ]
    vehicles = ["Hyundai Creta", "BMW 3 Series", "Kia Seltos", "Mahindra Thar", "Maruti Swift", "Honda City", "Tata Nexon", "Audi A4", "MG Hector"]
    statuses = ['Pending', 'Completed', 'Cancelled']

    now = timezone.now()
    bookings = []
    
    for _ in range(550):
        # Generate random dates over the last 30 days
        random_days_ago = random.randint(0, 30)
        random_date = now - timedelta(days=random_days_ago, hours=random.randint(1, 23))
        
        status = random.choices(statuses, weights=[15, 75, 10])[0] # 75% completed
        
        booking = Booking(
            customer=random.choice(customers),
            mechanic=random.choice(mechanics) if status != 'Pending' else None,
            vehicle=random.choice(vehicles),
            service=random.choice(services),
            status=status,
            amount=random.choice([1499.00, 3299.00, 2049.00, 5499.00, 4149.00, 899.00]),
        )
        booking.created_at = random_date # We override this after saving
        bookings.append(booking)

    # Bulk create for speed
    Booking.objects.bulk_create(bookings)
    
    # Update created_at (bulk_create bypasses auto_now_add)
    for b in Booking.objects.all():
        random_days_ago = random.randint(0, 30)
        b.created_at = now - timedelta(days=random_days_ago, hours=random.randint(1, 23))
        b.save()

    print("✅ Successfully seeded 50 Customers, 20 Mechanics, and 550 Bookings!")

if __name__ == "__main__":
    seed_data()