import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResultCard } from '@/components/ResultCard';
import { ChartLine, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

// Get current report from session storage or use mock data
const getCurrentReport = () => {
  const currentReport = sessionStorage.getItem('currentReport');
  if (currentReport) {
    return JSON.parse(currentReport);
  }
  
  // Fallback mock data
  return {
    fileName: 'Sample Report',
    date: new Date().toISOString(),
    results: [
      {
        name: 'Hemoglobin',
        value: '13.2',
        unit: 'g/dL',
        referenceRange: '12.0-16.0 g/dL',
        status: 'normal' as const,
        description: 'Hemoglobin carries oxygen from your lungs to the rest of your body. Normal levels indicate good oxygen transport capacity.'
      },
      {
        name: 'White Blood Cells',
        value: '8.5',
        unit: 'k/μL',
        referenceRange: '4.0-11.0 k/μL',
        status: 'normal' as const,
        description: 'White blood cells help fight infections and diseases. Normal levels suggest a healthy immune system.'
      },
      {
        name: 'Cholesterol (Total)',
        value: '220',
        unit: 'mg/dL',
        referenceRange: '<200 mg/dL',
        status: 'high' as const,
        description: 'Total cholesterol measures all cholesterol in your blood. Elevated levels may increase heart disease risk.'
      }
    ]
  };
};

const Results = () => {
  const navigate = useNavigate();
  const currentReport = getCurrentReport();
  const hasMultipleReports = JSON.parse(localStorage.getItem('bloodReports') || '[]').length > 1;

  const handleUploadAnother = () => {
    sessionStorage.removeItem('uploadedFile');
    sessionStorage.removeItem('currentReport');
    navigate('/');
  };

  const normalCount = currentReport.results.filter((r: any) => r.status === 'normal').length;
  const totalCount = currentReport.results.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with navigation */}
        <div className="flex items-center justify-between pt-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {hasMultipleReports && (
            <Button variant="outline" onClick={() => navigate('/timeline')}>
              <ChartLine className="h-4 w-4 mr-2" />
              View Timeline
            </Button>
          )}
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Blood Test Results</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Report from {format(new Date(currentReport.date), 'PPP')}
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span>{normalCount} Normal</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span>{totalCount - normalCount} Need Attention</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentReport.results.map((marker: any, index: number) => (
            <ResultCard key={index} marker={marker} />
          ))}
        </div>

        <div className="text-center space-y-4 pb-8">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            These results are for informational purposes only. Please consult with your healthcare provider for proper interpretation and medical advice.
          </p>
          <Button onClick={handleUploadAnother} size="lg" className="font-medium">
            Upload Another Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;