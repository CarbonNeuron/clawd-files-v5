import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function StatsCard({ icon: Icon, label, value }: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2">
          <Icon size={20} className="text-accent" />
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
        </div>
      </div>
    </Card>
  );
}
