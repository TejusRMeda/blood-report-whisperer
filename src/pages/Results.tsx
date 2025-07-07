import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResultCard } from '@/components/ResultCard';

// Mock blood test data
const mockResults = [
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
    name: 'Platelets',
    value: '185',
    unit: 'k/μL',
    referenceRange: '150-450 k/μL',
    status: 'normal' as const,
    description: 'Platelets help your blood clot to stop bleeding. Normal levels indicate proper clotting function.'
  },
  {
    name: 'Cholesterol (Total)',
    value: '220',
    unit: 'mg/dL',
    referenceRange: '<200 mg/dL',
    status: 'high' as const,
    description: 'Total cholesterol measures all cholesterol in your blood. Elevated levels may increase heart disease risk.'
  },
  {
    name: 'Blood Glucose',
    value: '95',
    unit: 'mg/dL',
    referenceRange: '70-100 mg/dL',
    status: 'normal' as const,
    description: 'Blood glucose measures sugar levels in your blood. Normal levels indicate good diabetes control.'
  },
  {
    name: 'Creatinine',
    value: '1.1',
    unit: 'mg/dL',
    referenceRange: '0.6-1.2 mg/dL',
    status: 'normal' as const,
    description: 'Creatinine measures kidney function. Normal levels suggest your kidneys are working properly.'
  }
];

const Results = () => {
  const navigate = useNavigate();

  const handleUploadAnother = () => {
    sessionStorage.removeItem('uploadedFile');
    navigate('/');
  };

  const normalCount = mockResults.filter(r => r.status === 'normal').length;
  const totalCount = mockResults.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-3xl font-bold">Your Blood Test Results</h1>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockResults.map((marker, index) => (
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