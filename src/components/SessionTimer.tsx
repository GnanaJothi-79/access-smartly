import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SessionTimerProps {
  startTime: Date;
  maxDuration?: number; // in minutes, default 180 (3 hours)
}

const SessionTimer = ({ startTime, maxDuration = 180 }: SessionTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const totalMinutes = Math.floor(elapsed / 60);
  const remainingMinutes = maxDuration - totalMinutes;
  const isNearEnd = remainingMinutes <= 30 && remainingMinutes > 0;
  const isOvertime = remainingMinutes <= 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">Session Duration</p>
          <p className="text-2xl font-bold tabular-nums">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
          <p className={`text-xs ${isOvertime ? "text-destructive" : isNearEnd ? "text-yellow-600" : "text-muted-foreground"}`}>
            {isOvertime 
              ? "Session expired - please log out" 
              : `${remainingMinutes} minutes remaining`
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SessionTimer;
