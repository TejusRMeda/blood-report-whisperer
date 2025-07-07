import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { ArrowLeft, Upload } from 'lucide-react';

interface BloodReport {
  id: number;
  fileName: string;
  date: string;
  results: Array<{
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    description: string;
  }>;
}

const Timeline = () => {
  const navigate = useNavigate();
  const reports: BloodReport[] = JSON.parse(localStorage.getItem('bloodReports') || '[]');

  if (reports.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold">No Reports Yet</h1>
          <p className="text-muted-foreground">
            Upload your first blood report to start tracking your health over time.
          </p>
          <Button onClick={() => navigate('/')} size="lg" className="w-full font-medium">
            <Upload className="mr-2 h-4 w-4" />
            Upload First Report
          </Button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = reports
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(report => ({
      date: format(new Date(report.date), 'MMM dd'),
      fullDate: report.date,
      ...report.results.reduce((acc, result) => ({
        ...acc,
        [result.name]: parseFloat(result.value)
      }), {})
    }));

  const markers = reports[0]?.results || [];

  const getReferenceRange = (range: string) => {
    // Parse reference ranges like "12.0-16.0 g/dL" or "<200 mg/dL"
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(s => parseFloat(s));
      return { min, max };
    } else if (range.startsWith('<')) {
      return { min: 0, max: parseFloat(range.substring(1)) };
    } else if (range.startsWith('>')) {
      return { min: parseFloat(range.substring(1)), max: Infinity };
    }
    return { min: 0, max: 100 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Health Timeline</h1>
              <p className="text-muted-foreground">{reports.length} reports tracked</p>
            </div>
          </div>
          <Button onClick={() => navigate('/')} className="font-medium">
            <Upload className="mr-2 h-4 w-4" />
            Add Report
          </Button>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markers.map((marker) => {
            const referenceRange = getReferenceRange(marker.referenceRange);
            
            return (
              <Card key={marker.name} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">{marker.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Reference: {marker.referenceRange}
                  </p>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      [marker.name]: {
                        label: marker.name,
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs fill-muted-foreground"
                        />
                        <YAxis 
                          className="text-xs fill-muted-foreground"
                          domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        
                        {/* Reference range background */}
                        {referenceRange.min > 0 && referenceRange.min !== Infinity && (
                          <ReferenceLine 
                            y={referenceRange.min} 
                            stroke="hsl(var(--warning))" 
                            strokeDasharray="5 5"
                            strokeOpacity={0.5}
                          />
                        )}
                        {referenceRange.max < Infinity && (
                          <ReferenceLine 
                            y={referenceRange.max} 
                            stroke="hsl(var(--warning))" 
                            strokeDasharray="5 5"
                            strokeOpacity={0.5}
                          />
                        )}
                        
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey={marker.name}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer"
                    onClick={() => {
                      sessionStorage.setItem('currentReport', JSON.stringify(report));
                      navigate('/results');
                    }}
                  >
                    <div>
                      <p className="font-medium">{report.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(report.date), 'PPP')}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {report.results.filter(r => r.status === 'normal').length}/{report.results.length} normal
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;