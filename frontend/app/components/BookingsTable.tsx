"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface BookingsTableProps {
  bookings: any[];
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  page: number;
  setPage: (val: number) => void;
  ordering: string;
  setOrdering: (val: string) => void;
}

export default function BookingsTable({
  bookings,
  totalCount,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  ordering,
  setOrdering
}: BookingsTableProps) {

  // Toggle sort direction when clicking a header
  const handleSort = (field: string) => {
    if (ordering === field) {
      setOrdering(`-${field}`); // Toggle to descending
    } else {
      setOrdering(field); // Set to ascending
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="shadow-lg border-muted h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Manage and track all service requests.</CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to page 1 on search
                }}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1); // Reset to page 1 on filter
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="border rounded-md flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle & Service</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/80 transition-colors text-right"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Date <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(bookings || []).map((booking: any) => (
                <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-xs">#{booking.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="font-medium">{booking.customer_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.vehicle}</span>
                      <span className="text-xs text-muted-foreground">{booking.service}</span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.mechanic_name || 'Unassigned'}</TableCell>
                  <TableCell>₹{booking.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Date(booking.created_at).toLocaleDateString(undefined, { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No bookings found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modern Pagination Controls */}
        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {bookings.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, totalCount)} of {totalCount} entries
          </p>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Generate Page Numbers with Ellipses */}
            {(() => {
              const totalPages = Math.ceil(totalCount / 10);
              const pages = [];
              
              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                  pages.push(
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setPage(i)}
                    >
                      {i}
                    </Button>
                  );
                } else if (i === page - 2 || i === page + 2) {
                  pages.push(<span key={i} className="px-2 text-muted-foreground">...</span>);
                }
              }
              return pages;
            })()}

            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(totalCount / 10)} 
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}