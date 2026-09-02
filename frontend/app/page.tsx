"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { IndianRupee, CalendarDays, Wrench, Users, Activity, CheckCircle, Clock, XCircle, LogOut } from "lucide-react";
import StatCard from "./components/StatCard";
import BookingsTable from "./components/BookingsTable";
import AnalyticsCharts from "./components/AnalyticsCharts";
import MechanicsTable from "./components/MechanicsTable";
import { ThemeToggle } from "./components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; 
import { API_BASE_URL } from "@/lib/api";

export default function Dashboard() {
  const { data: session } = useSession();
  
  // States
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0); 
  
  // Table Controls (Search, Filter, Sort, Pagination)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("-created_at"); 

  const fetchData = async () => {
    const token = (session as any)?.accessToken;
    if (!token) return;

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      // 1. Fetch Dashboard Stats, Charts, & Mechanics
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.overview);
        setChartData(statsData.charts);
        setMechanics(statsData.mechanics);
      }

      // 2. Fetch Bookings Table Data (with URL parameters for filtering/sorting)
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (statusFilter && statusFilter !== "all") queryParams.append("status", statusFilter);
      queryParams.append("page", page.toString());
      queryParams.append("ordering", ordering);
      
      const url = `${API_BASE_URL}/bookings/?${queryParams.toString()}`;
      const bookingsRes = await fetch(url, { headers });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.results || []);
        setTotalBookings(bookingsData.count || 0); 
      }
      else {
        setBookings([]); // Safe fallback
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBookings([]);
    }
  };

  // Re-fetch data whenever any of the table controls change
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [searchTerm, statusFilter, page, ordering, session]); 

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl font-semibold">Loading Live Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors duration-300">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Operations</h1>
          <p className="text-muted-foreground mt-1">Instant Mechanic Service Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <Activity size={16} className="animate-pulse" />
            Live Updates Active
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* 1. Overview KPIs (8 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} 
          icon={<IndianRupee size={20} />} 
          className="bg-primary text-primary-foreground" 
        />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={<Activity size={20} />} />
        <StatCard title="Today's Bookings" value={stats?.todaysBookings || 0} icon={<CalendarDays size={20} />} />
        <StatCard title="Completed Bookings" value={stats?.completedBookings || 0} icon={<CheckCircle size={20} className="text-green-500" />} />
        <StatCard title="Pending Bookings" value={stats?.pendingBookings || 0} icon={<Clock size={20} className="text-orange-500" />} />
        <StatCard title="Cancelled Bookings" value={stats?.cancelledBookings || 0} icon={<XCircle size={20} className="text-red-500" />} />
        <StatCard title="Active Mechanics" value={stats?.activeMechanics || 0} icon={<Wrench size={20} />} />
        <StatCard title="New Customers" value={stats?.newCustomers || 0} icon={<Users size={20} />} />
      </div>

      {/* 2. Visual Analytics (4 Charts) */}
      {chartData && (
        <AnalyticsCharts 
          statusData={chartData.status_breakdown} 
          revenueData={chartData.revenue_over_time} 
          bookingsData={chartData.bookings_over_time} // New dataset
          serviceData={chartData.service_breakdown}   // New dataset
        />
      )}

      {/* 3. Tables Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        
        {/* Bookings Table (Takes up 2/3 of the width on large screens) */}
        <div className="xl:col-span-2">
          <BookingsTable 
            bookings={bookings}
            totalCount={totalBookings}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            page={page} // New prop
            setPage={setPage} // New prop
            ordering={ordering} // New prop
            setOrdering={setOrdering} // New prop
          />
        </div>

        {/* Mechanics Table (Takes up 1/3 of the width on large screens) */}
        <div className="xl:col-span-1">
          <MechanicsTable mechanics={mechanics} />
        </div>

      </div>
    </div>
  );
}