export const BUSSINES_PHONE_NUMBER = "+359 876 603 499";
export const WORKING_TIME = "09:00-17:30";
export const ADDRESS_TOWN = "Бургас";
export const ADDRESS_STREET = "Индустриална 5";
export const WORKING_TIME_WEEKEND = "10:00-14:00";

export function getWorkingHoursForDay(date: Date = new Date()): number {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday=0, Saturday=6
  const timeRange = isWeekend ? WORKING_TIME_WEEKEND : WORKING_TIME;

  const [start, end] = timeRange.split("-");
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const totalMinutes = endTotalMinutes - startTotalMinutes;
  return totalMinutes / 60; // return hours as decimal
}

export function getOpeningTimeDateForDay(date: Date = new Date()): Date {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const timeRange = isWeekend ? WORKING_TIME_WEEKEND : WORKING_TIME;
  const [openingTime] = timeRange.split("-");

  const [hours, minutes] = openingTime.split(":").map(Number);

  // Create a new Date with the same year/month/day but set to opening time
  const openingDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );

  return openingDate;
}
