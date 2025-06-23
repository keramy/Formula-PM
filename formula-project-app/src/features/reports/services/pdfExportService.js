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
      
      // Add project information
      if (opts.projectData) {
        yPosition = this.addProjectInfo(pdf, opts.projectData, yPosition, contentWidth, opts);
      }
      
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
   * Add project information
   */
  addProjectInfo(pdf, projectData, yPosition, contentWidth, opts) {
    const { fontSize } = opts;
    
    pdf.setFontSize(fontSize.heading);
    pdf.setFont(undefined, 'bold');
    pdf.text('Project Information', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(fontSize.body);
    pdf.setFont(undefined, 'normal');

    if (projectData.name) {
      pdf.text(`Project: ${projectData.name}`, 20, yPosition);
      yPosition += 6;
    }

    if (projectData.client) {
      pdf.text(`Client: ${projectData.client}`, 20, yPosition);
      yPosition += 6;
    }

    if (projectData.location) {
      pdf.text(`Location: ${projectData.location}`, 20, yPosition);
      yPosition += 6;
    }

    if (projectData.manager) {
      pdf.text(`Project Manager: ${projectData.manager}`, 20, yPosition);
      yPosition += 6;
    }

    if (projectData.type) {
      pdf.text(`Project Type: ${projectData.type}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 10;

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
          if (yPosition > pdf.internal.pageSize.getHeight() - 100) {
            pdf.addPage();
            yPosition = 20;
          }
          
          // Calculate image dimensions
          const maxImageWidth = Math.min(contentWidth * 0.7, 100);
          const maxImageHeight = 70;
          
          // Convert image to base64 if it's a file or blob
          let imageData = image.url;
          if (image.file) {
            imageData = await this.fileToBase64(image.file);
          }
          
          // Try to add actual image
          try {
            // Create a temporary image element to get dimensions
            const img = new Image();
            img.src = imageData;
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                // Calculate aspect ratio
                const aspectRatio = img.width / img.height;
                let imageWidth = maxImageWidth;
                let imageHeight = imageWidth / aspectRatio;
                
                // If height is too large, scale down
                if (imageHeight > maxImageHeight) {
                  imageHeight = maxImageHeight;
                  imageWidth = imageHeight * aspectRatio;
                }
                
                // Add image to PDF
                pdf.addImage(imageData, 'JPEG', 20, yPosition, imageWidth, imageHeight, undefined, 'FAST');
                resolve();
              };
              img.onerror = reject;
            });
            
            // Calculate final image dimensions for spacing
            const aspectRatio = img.width / img.height;
            let finalWidth = maxImageWidth;
            let finalHeight = finalWidth / aspectRatio;
            if (finalHeight > maxImageHeight) {
              finalHeight = maxImageHeight;
              finalWidth = finalHeight * aspectRatio;
            }
            
            yPosition += finalHeight + 5;
          } catch (imageError) {
            console.warn('Could not embed image, using placeholder:', imageError);
            
            // Fallback to placeholder
            const imageWidth = maxImageWidth;
            const imageHeight = maxImageHeight;
            
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPosition, imageWidth, imageHeight, 'F');
            pdf.setFontSize(fontSize.caption);
            pdf.text('Image Preview', 25, yPosition + imageHeight/2);
            
            yPosition += imageHeight + 5;
          }
          
          // Add caption if available
          if (image.caption) {
            pdf.setFontSize(fontSize.caption);
            pdf.setFont(undefined, 'italic');
            const captionLines = pdf.splitTextToSize(image.caption, maxImageWidth);
            pdf.text(captionLines, 20, yPosition);
            yPosition += (captionLines.length * 4) + 5;
          }
          
          yPosition += 5;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          yPosition += 20;
        }
      }
    }

    yPosition += 5;
    
    // Add separator line
    pdf.setLineWidth(0.2);
    pdf.line(20, yPosition, 20 + contentWidth, yPosition);
    yPosition += 10;

    return yPosition;
  }

  /**
   * Convert file to base64
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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