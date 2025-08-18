"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface CalendarDateRangePickerProps {
  className?: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: CalendarDateRangePickerProps) {
  const handlePresetSelect = (value: string) => {
    const today = new Date();
    switch (value) {
      case "today":
        onDateRangeChange({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = addDays(today, -1);
        onDateRangeChange({ from: yesterday, to: yesterday });
        break;
      case "last7":
        onDateRangeChange({ from: addDays(today, -7), to: today });
        break;
      case "last30":
        onDateRangeChange({ from: addDays(today, -30), to: today });
        break;
      case "thisMonth":
        onDateRangeChange({
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: today,
        });
        break;
      case "lastMonth":
        const firstDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        onDateRangeChange({
          from: firstDayLastMonth,
          to: lastDayLastMonth,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} -{" "}
                  {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <div className="p-2 border-r">
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Presets" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
