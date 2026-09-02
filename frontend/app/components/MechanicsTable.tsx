"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MechanicsTable({ mechanics }: { mechanics: any[] }) {
  return (
    <Card className="h-full shadow-lg border-muted">
      <CardHeader>
        <CardTitle>Active Mechanics</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[650px] overflow-y-auto pr-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mechanic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead className="hidden sm:table-cell">Last Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(mechanics || []).map((m: any) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>
                  <Badge variant={m.status === "Available" ? "default" : "secondary"}>
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell>{m.jobs_completed}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                  {m.last_booking}
                </TableCell>
              </TableRow>
            ))}
            {mechanics.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No mechanics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}