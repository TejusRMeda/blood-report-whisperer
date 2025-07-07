import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';

const Landing = () => {
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    // Store file in session storage or context
    sessionStorage.setItem('uploadedFile', file.name);
    navigate('/processing');
  };

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
            Understand Your Blood Test in Seconds
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Upload your blood report and get instant, easy-to-understand results with professional insights.
          </p>
        </div>
        
        <FileUpload onFileSelect={handleFileSelect} className="max-w-md mx-auto" />
        
        <p className="text-sm text-muted-foreground">
          Supports PDF, JPG, and PNG formats. Your data is processed securely.
        </p>
      </div>
    </div>
  );
};

export default Landing;