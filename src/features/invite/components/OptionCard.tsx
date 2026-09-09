import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  emoji?: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ emoji, label, description, selected, onSelect }: OptionCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-pointer select-none p-4 transition-all hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        {emoji && <span className="text-2xl leading-none">{emoji}</span>}
        <div className="flex-1">
          <p className="font-medium text-foreground">{label}</p>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </Card>
  );
}
