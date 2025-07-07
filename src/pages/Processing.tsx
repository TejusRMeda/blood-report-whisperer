import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Processing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      navigate('/results');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Analyzing Your Report</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our AI is carefully reviewing your blood test results. This will just take a moment...
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Processing;