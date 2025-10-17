import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleQuickFilter = (type: 'today' | 'week' | 'month' | 'year' | 'all') => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (type) {
      case 'today':
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'week':
        start = new Date(today.setDate(today.getDate() - 7));
        end = new Date();
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'all':
        start = null;
        end = null;
        break;
    }

    setStartDate(start);
    setEndDate(end);
    onFilterChange(start, end);
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onFilterChange(start, end);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter('today')}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter('week')}>
          This Week
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter('month')}>
          This Month
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter('year')}>
          This Year
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter('all')}>
          All Time
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => handleCustomDateChange(date || null, endDate)}
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => handleCustomDateChange(startDate, date || null)}
              disabled={(date) => startDate ? date < startDate : false}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
