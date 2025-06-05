import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn/ui path

interface KpiCardProps {
  title: string;
  value: number;
  trend?: string;
  icon?: React.ReactNode;
  badgeColor?: string; // e.g., 'bg-blue-100'
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  trend,
  badgeColor,
}) => {
  // Basic trend color logic, can be expanded
  const trendColor = trend?.startsWith("+")
    ? "text-green-600"
    : trend?.startsWith("-")
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon ? (
          badgeColor ? (
            <div className={`p-1.5 rounded-md ${badgeColor}`}>{icon}</div>
          ) : (
            icon
          )
        ) : // Render icon directly if no badgeColor is provided
        null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendColor}`}>{trend} from last period</p>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
