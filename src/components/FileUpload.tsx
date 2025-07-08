import { useState, useCallback } from 'react';
import { Upload, Calendar as CalendarIcon, X, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportData {
  id: string;
  file: File;
  date: Date;
}

interface FileUploadProps {
  onFileSelect: (reports: ReportData[]) => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);

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

  const addReport = useCallback(() => {
    if (selectedFile && selectedDate) {
      const newReport: ReportData = {
        id: Date.now().toString(),
        file: selectedFile,
        date: selectedDate
      };
      setReports(prev => [...prev, newReport]);
      setSelectedFile(null);
      setSelectedDate(new Date());
    }
  }, [selectedFile, selectedDate]);

  const removeReport = useCallback((id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  }, []);

  const handleUploadAll = useCallback(() => {
    if (reports.length > 0) {
      onFileSelect(reports);
    }
  }, [reports, onFileSelect]);

  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Added Reports List */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reports to Upload ({reports.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(report.date, "PPP")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReport(report.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Date Selection Card */}
        <div className="space-y-4 p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Report Date</h3>
              <p className="text-sm text-muted-foreground">When was this test done?</p>
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Select test date</span>}
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

        {/* File Upload Card */}
        <div className="space-y-4 p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Upload Report</h3>
              <p className="text-sm text-muted-foreground">PDF, JPG, or PNG format</p>
            </div>
          </div>

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
              isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30",
              selectedFile ? "border-success bg-success/5" : "hover:bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-8 h-8 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                  <Upload className="h-4 w-4 text-success" />
                </div>
                <p className="font-medium text-success">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="font-medium">Drop file here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG</p>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {selectedFile && selectedDate && (
          <Button 
            onClick={addReport} 
            variant="outline"
            className="w-full max-w-md mx-auto font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Report
          </Button>
        )}

        {reports.length > 0 && (
          <Button 
            onClick={handleUploadAll} 
            size="lg" 
            className="w-full max-w-md mx-auto font-medium"
          >
            Upload & Analyze {reports.length} Report{reports.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>
    </div>
  );
};