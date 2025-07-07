import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';

const Landing = () => {
  const navigate = useNavigate();

  const handleFileSelect = (file: File, date: Date) => {
    // Store file and date in localStorage for timeline tracking
    const existingReports = JSON.parse(localStorage.getItem('bloodReports') || '[]');
    const newReport = {
      id: Date.now(),
      fileName: file.name,
      date: date.toISOString(),
      // Mock data - in real app, this would come from file processing
      results: generateMockResults()
    };
    
    const updatedReports = [...existingReports, newReport];
    localStorage.setItem('bloodReports', JSON.stringify(updatedReports));
    sessionStorage.setItem('currentReport', JSON.stringify(newReport));
    
    navigate('/processing');
  };

  const generateMockResults = () => [
    {
      name: 'Hemoglobin',
      value: (12 + Math.random() * 4).toFixed(1),
      unit: 'g/dL',
      referenceRange: '12.0-16.0 g/dL',
      status: 'normal' as const,
      description: 'Hemoglobin carries oxygen from your lungs to the rest of your body.'
    },
    {
      name: 'White Blood Cells',
      value: (4 + Math.random() * 7).toFixed(1),
      unit: 'k/μL',
      referenceRange: '4.0-11.0 k/μL',
      status: 'normal' as const,
      description: 'White blood cells help fight infections and diseases.'
    },
    {
      name: 'Cholesterol (Total)',
      value: (180 + Math.random() * 60).toFixed(0),
      unit: 'mg/dL',
      referenceRange: '<200 mg/dL',
      status: Math.random() > 0.5 ? 'normal' : 'high' as const,
      description: 'Total cholesterol measures all cholesterol in your blood.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Track Your Health Over Time
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Upload blood reports with dates to track your health markers and see trends over time.
          </p>
        </div>
        
        <FileUpload onFileSelect={handleFileSelect} className="max-w-md mx-auto" />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <p className="text-sm text-muted-foreground">
            Supports PDF, JPG, and PNG formats. Your data is processed securely.
          </p>
          {JSON.parse(localStorage.getItem('bloodReports') || '[]').length > 0 && (
            <button
              onClick={() => navigate('/timeline')}
              className="text-sm text-primary hover:underline font-medium"
            >
              View Timeline →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;