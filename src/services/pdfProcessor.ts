import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedData {
  rawText: string;
  bloodMarkers: BloodMarker[];
  processingMethod: 'pdf-text' | 'ocr';
}

export interface BloodMarker {
  name: string;
  value: string;
  unit: string;
  referenceRange?: string;
  status?: 'normal' | 'high' | 'low';
}

export class PDFProcessor {
  static async extractFromPDF(file: File): Promise<ExtractedData> {
    try {
      // First try to extract text directly from PDF
      const pdfText = await this.extractTextFromPDF(file);
      
      if (pdfText.trim().length > 50) {
        // PDF has selectable text, use it
        const bloodMarkers = this.parseBloodMarkers(pdfText);
        return {
          rawText: pdfText,
          bloodMarkers,
          processingMethod: 'pdf-text'
        };
      } else {
        // PDF is likely scanned, use OCR
        const ocrText = await this.extractTextWithOCR(file);
        const bloodMarkers = this.parseBloodMarkers(ocrText);
        return {
          rawText: ocrText,
          bloodMarkers,
          processingMethod: 'ocr'
        };
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  private static async extractTextWithOCR(file: File): Promise<string> {
    const worker = await createWorker('eng');
    
    try {
      // Convert PDF to image first (simplified approach)
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Process first page only for demo (can be extended)
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to image data for OCR
      const imageData = canvas.toDataURL('image/png');
      
      const result = await worker.recognize(imageData);
      fullText = result.data.text;
      
      return fullText;
    } finally {
      await worker.terminate();
    }
  }

  private static parseBloodMarkers(text: string): BloodMarker[] {
    const markers: BloodMarker[] = [];
    const lines = text.split('\n');
    
    // Common blood test patterns
    const patterns = [
      // Pattern: "Hemoglobin 13.2 g/dL (12.0-16.0)"
      /(\w+(?:\s+\w+)*)\s+(\d+\.?\d*)\s*([a-zA-Z\/μℓ%]+)?\s*(?:\(([^)]+)\))?/g,
      // Pattern: "WBC: 8.5 k/μL"
      /([A-Za-z\s]+):\s*(\d+\.?\d*)\s*([a-zA-Z\/μℓ%]+)?/g,
    ];

    // Known blood test markers to look for
    const knownMarkers = [
      'hemoglobin', 'hgb', 'hb',
      'white blood cells', 'wbc', 'leukocytes',
      'red blood cells', 'rbc', 'erythrocytes',
      'platelets', 'plt',
      'hematocrit', 'hct',
      'glucose', 'blood sugar',
      'cholesterol', 'total cholesterol',
      'hdl', 'ldl',
      'triglycerides',
      'creatinine',
      'bun', 'blood urea nitrogen',
      'alt', 'ast',
      'bilirubin'
    ];

    for (const line of lines) {
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const [, name, value, unit, range] = match;
          
          // Check if this looks like a blood marker
          const nameLower = name.toLowerCase().trim();
          const isKnownMarker = knownMarkers.some(marker => 
            nameLower.includes(marker) || marker.includes(nameLower)
          );
          
          if (isKnownMarker && value && !isNaN(parseFloat(value))) {
            const numValue = parseFloat(value);
            let status: 'normal' | 'high' | 'low' | undefined;
            
            // Simple status determination (can be enhanced)
            if (range) {
              const rangeMatch = range.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
              if (rangeMatch) {
                const [, min, max] = rangeMatch;
                const minVal = parseFloat(min);
                const maxVal = parseFloat(max);
                
                if (numValue < minVal) status = 'low';
                else if (numValue > maxVal) status = 'high';
                else status = 'normal';
              }
            }
            
            markers.push({
              name: this.formatMarkerName(name),
              value: value,
              unit: unit || '',
              referenceRange: range,
              status
            });
          }
        }
      }
    }

    return markers;
  }

  private static formatMarkerName(name: string): string {
    // Clean up and format marker names
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}