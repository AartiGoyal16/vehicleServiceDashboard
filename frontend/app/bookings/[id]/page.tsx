"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Car, Wrench, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BookingDetail() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/bookings/${params.id}/`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading details...</div>;
  }

  if (!booking) {
    return <div className="flex h-screen items-center justify-center">Booking not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="mb-6 -ml-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking #{booking.id}</h1>
            <p className="text-muted-foreground mt-1">
              Created on {new Date(booking.created_at).toLocaleString()}
            </p>
          </div>
          <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'} className="text-sm px-4 py-1">
            {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User size={20} className="text-blue-500" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customer_name}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car size={20} className="text-green-500" /> Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{booking.vehicle}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench size={20} className="text-orange-500" /> Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Requested Service</p>
                <p className="font-medium">{booking.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Mechanic</p>
                <p className="font-medium">{booking.mechanic_name || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">₹{booking.amount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}