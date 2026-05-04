"use client";

import { DayView } from "./components/DayView";
import { useState } from "react";

export default function AppointmentsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <label className="font-medium">Odaberi datum:</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <DayView date={selectedDate} />
    </div>
  );
}
