from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Mechanic, Booking

# --- Existing Dashboard Serializers ---

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class MechanicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mechanic
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    # These read-only fields match the data your Next.js frontend expects
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    mechanic_name = serializers.CharField(source='mechanic.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'

# --- New Authentication Serializer ---

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['admin', 'operations'], write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', 'operations')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        
        if role == 'admin':
            user.is_staff = True
            user.save()
            
        return user