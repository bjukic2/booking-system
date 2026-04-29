"use client";

import { useAppointments } from "@/lib/hooks/useAppointments";
import { DayView } from "./components/DayView";

export default function AppointmentsPage() {
  const { data, isLoading } = useAppointments();

  if (isLoading) return <div>Stranica se učitava...</div>;

  return (
    <div className="p-6">
      <DayView appointments={data ?? []} />
    </div>
  );
}
