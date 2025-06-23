/**
 * PDF Export Service - Generates professional PDFs from reports
 * Uses jsPDF and html2canvas for high-quality document generation
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFExportService {
  constructor() {
    this.defaultOptions = {
      pageSize: 'A4',
      orientation: 'portrait',
      imageQuality: 0.8,
      margin: 20,
      fontSize: {
        title: 20,
        heading: 16,
        body: 12,
        caption: 10
      }
    };
  }

  /**
   * Generate PDF from report data
   */
  async generateReportPDF(report, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: 'mm',
        format: opts.pageSize
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = opts.margin;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;

      // Add header
      yPosition = this.addHeader(pdf, report, yPosition, contentWidth, opts);
      
      // Add metadata
      yPosition = this.addMetadata(pdf, report, yPosition, contentWidth, opts);
      
      // Flatten all lines from all sections
      const allLines = [];
      (report.sections || []).forEach(section => {
        (section.lines || []).forEach(line => {
          allLines.push({
            ...line,
            sectionTitle: section.title
          });
        });
      });

      // Add content for each line
      for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i];
        
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }
        
        yPosition = await this.addLineContent(pdf, line, i + 1, yPosition, contentWidth, opts);
      }

      // Add footer
      this.addFooter(pdf, pageWidth, pageHeight);

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Add report header
   */
  addHeader(pdf, report, yPosition, contentWidth, opts) {
    const { fontSize } = opts;
    
    // Title
    pdf.setFontSize(fontSize.title);
    pdf.setFont(undefined, 'bold');
    pdf.text(report.title || 'Construction Report', 20, yPosition);
    yPosition += 15;

    // Report number and date
    pdf.setFontSize(fontSize.body);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Report Number: ${report.metadata?.reportNumber || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    
    const reportDate = new Date(report.createdAt || Date.now()).toLocaleDateString();
    pdf.text(`Date: ${reportDate}`, 20, yPosition);
    yPosition += 8;
    
    pdf.text(`Created by: ${report.createdBy || 'Unknown'}`, 20, yPosition);
    yPosition += 15;

    // Add horizontal line
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, 20 + contentWidth, yPosition);
    yPosition += 10;

    return yPosition;
  }

  /**
   * Add construction metadata
   */
  addMetadata(pdf, report, yPosition, contentWidth, opts) {
    const { fontSize } = opts;
    const metadata = report.metadata || {};
    
    if (metadata.weather || metadata.temperature || metadata.workingHours) {
      pdf.setFontSize(fontSize.heading);
      pdf.setFont(undefined, 'bold');
      pdf.text('Project Information', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(fontSize.body);
      pdf.setFont(undefined, 'normal');

      if (metadata.weather) {
        pdf.text(`Weather: ${metadata.weather}`, 20, yPosition);
        yPosition += 6;
      }

      if (metadata.temperature) {
        pdf.text(`Temperature: ${metadata.temperature}`, 20, yPosition);
        yPosition += 6;
      }

      if (metadata.workingHours) {
        const hours = `${metadata.workingHours.start || ''} - ${metadata.workingHours.end || ''}`;
        pdf.text(`Working Hours: ${hours}`, 20, yPosition);
        yPosition += 6;
      }

      if (metadata.projectPhase) {
        pdf.text(`Project Phase: ${metadata.projectPhase}`, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 10;
    }

    return yPosition;
  }

  /**
   * Add line content with description and images
   */
  async addLineContent(pdf, line, lineNumber, yPosition, contentWidth, opts) {
    const { fontSize } = opts;
    
    // Line header
    pdf.setFontSize(fontSize.heading);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Line ${lineNumber}`, 20, yPosition);
    yPosition += 10;

    // Description
    if (line.description) {
      pdf.setFontSize(fontSize.body);
      pdf.setFont(undefined, 'normal');
      
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(line.description, contentWidth);
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 5;
    }

    // Images
    if (line.images && line.images.length > 0) {
      yPosition += 5;
      
      for (let i = 0; i < line.images.length; i++) {
        const image = line.images[i];
        
        try {
          // Check if we need a new page for the image
          if (yPosition > pdf.internal.pageSize.getHeight() - 80) {
            pdf.addPage();
            yPosition = 20;
          }
          
          // Add image if available (for demo, we'll add a placeholder)
          const imageWidth = Math.min(contentWidth * 0.6, 80);
          const imageHeight = 60;
          
          // Add placeholder rectangle for image
          pdf.setFillColor(240, 240, 240);
          pdf.rect(20, yPosition, imageWidth, imageHeight, 'F');
          
          // Add image placeholder text
          pdf.setFontSize(fontSize.caption);
          pdf.text('Image Placeholder', 25, yPosition + 30);
          
          // Add caption if available
          if (image.caption) {
            pdf.setFontSize(fontSize.caption);
            const captionLines = pdf.splitTextToSize(image.caption, imageWidth);
            pdf.text(captionLines, 20, yPosition + imageHeight + 5);
            yPosition += imageHeight + (captionLines.length * 4) + 10;
          } else {
            yPosition += imageHeight + 10;
          }
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          yPosition += 20;
        }
      }
    }

    yPosition += 10;
    
    // Add separator line
    pdf.setLineWidth(0.2);
    pdf.line(20, yPosition, 20 + contentWidth, yPosition);
    yPosition += 10;

    return yPosition;
  }

  /**
   * Add footer to all pages
   */
  addFooter(pdf, pageWidth, pageHeight) {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      
      // Page number
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 10);
      
      // Generated by
      pdf.text('Generated by Formula PM', 20, pageHeight - 10);
    }
  }

  /**
   * Download PDF file
   */
  downloadPDF(pdf, filename) {
    const finalFilename = filename || `report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(finalFilename);
  }

  /**
   * Get PDF as blob for sharing
   */
  getPDFBlob(pdf) {
    return pdf.output('blob');
  }
}

export default new PDFExportService();