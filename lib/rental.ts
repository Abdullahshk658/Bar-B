import { addDays, eachDayOfInterval, isAfter, isBefore, isEqual, parseISO } from "date-fns";

import type { Rental } from "@/lib/types";

const SECURITY_DEPOSIT_RATE = 0.35;

export const calculateSecurityDeposit = (rentalPrice: number): number => {
  return Math.ceil(rentalPrice * SECURITY_DEPOSIT_RATE);
};

export const toCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
};

export const getBookedDates = (rentals: Rental[]): Date[] => {
  return rentals.flatMap((rental) => {
    if (rental.status === "cancelled") {
      return [];
    }

    const start = parseISO(rental.start_date);
    const end = parseISO(rental.end_date);

    return eachDayOfInterval({ start, end });
  });
};

export const isRangeOverlapping = (
  startDate: Date,
  endDate: Date,
  rentals: Rental[]
): boolean => {
  return rentals.some((rental) => {
    if (rental.status === "cancelled") {
      return false;
    }

    const bookedStart = parseISO(rental.start_date);
    const bookedEnd = parseISO(rental.end_date);

    return (
      (isAfter(startDate, bookedStart) || isEqual(startDate, bookedStart) || isBefore(startDate, bookedEnd)) &&
      (isBefore(endDate, bookedEnd) || isEqual(endDate, bookedEnd) || isAfter(endDate, bookedStart))
    );
  });
};

export const getMinimumRentalStartDate = (): Date => {
  return addDays(new Date(), 2);
};
