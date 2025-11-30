import * as React from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "cursor-pointer"
        )}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((label, index) => (
            <span
              key={value[index]}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
            >
              {label}
              {!disabled && (
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => handleRemove(value[index], e)}
                />
              )}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                value.includes(option.value) && "bg-accent"
              )}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {value.includes(option.value) && <Check className="h-4 w-4" />}
              </span>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
