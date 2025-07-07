import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const Error = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    sessionStorage.removeItem('uploadedFile');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Analysis Failed</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't read your report. This might be due to image quality, file format, or unclear text.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleTryAgain} size="lg" className="w-full font-medium">
            Try Another File
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Tips for better results:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Ensure the image is clear and well-lit</li>
              <li>Use PDF format when possible</li>
              <li>Make sure all text is readable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;