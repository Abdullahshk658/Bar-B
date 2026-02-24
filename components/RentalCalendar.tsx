"use client";

import "react-day-picker/dist/style.css";

import { DayPicker } from "react-day-picker";

import { toCurrency } from "@/lib/rental";

export type RentalDateRange = {
  from: Date;
  to?: Date;
};

export const RentalCalendar = ({
  bookedDates,
  minDate,
  selected,
  onChange,
  rentPrice,
  deposit
}: {
  bookedDates: Date[];
  minDate: Date;
  selected: RentalDateRange | undefined;
  onChange: (range: RentalDateRange | undefined) => void;
  rentPrice: number;
  deposit: number;
}) => {
  return (
    <div className="space-y-4 rounded-2xl border border-champagne/55 bg-white p-4 shadow-luxe daypicker-shell">
      <p className="text-xs uppercase tracking-[0.16em] text-charcoal/60">Rental Calendar</p>
      <DayPicker
        mode="range"
        numberOfMonths={1}
        selected={selected}
        onSelect={(range: unknown) => onChange(range as RentalDateRange | undefined)}
        disabled={[...bookedDates, { before: minDate }]}
        className="mx-auto"
      />
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-champagne/40 px-2 py-1">Rent {toCurrency(rentPrice)}</span>
        <span className="rounded-full bg-charcoal px-2 py-1 text-ivory">Deposit {toCurrency(deposit)}</span>
      </div>
      <p className="text-xs text-charcoal/70">Booked dates are blocked automatically. Minimum lead time is 48 hours.</p>
    </div>
  );
};
