import { useState, useCallback } from 'react';
import { Upload, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File, date: Date) => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile && selectedDate) {
      onFileSelect(selectedFile, selectedDate);
    }
  }, [selectedFile, selectedDate, onFileSelect]);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Date Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Report Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* File Upload */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5",
          isDragOver ? "border-primary bg-primary/10" : "border-border",
          selectedFile ? "border-success bg-success/5" : "bg-card"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          {selectedFile ? selectedFile.name : "Upload Your Blood Report"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {selectedFile ? "File selected! Choose upload to continue." : "Drag and drop your PDF, or click to browse"}
        </p>
        <Button variant="outline" className="mt-2">
          {selectedFile ? "Change File" : "Choose File"}
        </Button>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <Button 
          onClick={handleUpload} 
          size="lg" 
          className="w-full font-medium"
        >
          Upload & Analyze Report
        </Button>
      )}
    </div>
  );
};