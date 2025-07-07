import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BloodMarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  description: string;
}

interface ResultCardProps {
  marker: BloodMarker;
}

const statusConfig = {
  normal: {
    color: 'bg-success text-success-foreground',
    label: 'Normal'
  },
  high: {
    color: 'bg-warning text-warning-foreground', 
    label: 'High'
  },
  low: {
    color: 'bg-warning text-warning-foreground',
    label: 'Low'
  },
  critical: {
    color: 'bg-destructive text-destructive-foreground',
    label: 'Critical'
  }
};

export const ResultCard = ({ marker }: ResultCardProps) => {
  const statusStyle = statusConfig[marker.status];

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{marker.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{marker.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{marker.value}</span>
              <span className="text-sm text-muted-foreground">{marker.unit}</span>
            </div>
            <Badge className={cn("text-xs font-medium", statusStyle.color)}>
              {statusStyle.label}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Reference: {marker.referenceRange}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};