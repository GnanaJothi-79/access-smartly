import { Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SystemCardProps {
  systemNumber: number;
  isOccupied: boolean;
  occupiedBy?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SystemCard = ({ systemNumber, isOccupied, occupiedBy, onClick, disabled }: SystemCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105",
        isOccupied 
          ? "bg-destructive/10 border-destructive hover:bg-destructive/20" 
          : "bg-success/10 border-success hover:bg-success/20",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      onClick={!disabled && !isOccupied ? onClick : undefined}
    >
      <Monitor 
        className={cn(
          "h-8 w-8",
          isOccupied ? "text-destructive" : "text-success"
        )} 
      />
      <div className="text-center">
        <p className="font-semibold">System {systemNumber}</p>
        <p className={cn(
          "text-xs",
          isOccupied ? "text-destructive" : "text-success"
        )}>
          {isOccupied ? "Occupied" : "Vacant"}
        </p>
        {occupiedBy && (
          <p className="text-xs text-muted-foreground mt-1">{occupiedBy}</p>
        )}
      </div>
    </Card>
  );
};

export default SystemCard;
