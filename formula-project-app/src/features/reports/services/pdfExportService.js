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

      // Add header with integrated project information
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
    
    // Company header
    pdf.setFontSize(fontSize.heading);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Formula PM - Construction Report', 20, yPosition);
    yPosition += 10;
    
    // Title
    pdf.setFontSize(fontSize.title);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(report.title || 'Construction Report', 20, yPosition);
    yPosition += 15;

    // Combined metadata and project info in two columns
    const leftColumnX = 20;
    const rightColumnX = 20 + (contentWidth / 2);
    const metadataStartY = yPosition;
    
    pdf.setFontSize(fontSize.body);
    pdf.setFont(undefined, 'normal');
    
    // Left column - Report Information
    pdf.text(`Report Number: ${report.metadata?.reportNumber || 'N/A'}`, leftColumnX, yPosition);
    yPosition += 6;
    
    const reportDate = new Date(report.createdAt || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Date: ${reportDate}`, leftColumnX, yPosition);
    yPosition += 6;
    
    pdf.text(`Created by: ${report.createdBy || 'Unknown'}`, leftColumnX, yPosition);
    yPosition += 6;
    
    const totalLines = (report.sections || []).reduce((count, section) => count + (section.lines || []).length, 0);
    pdf.text(`Total Lines: ${totalLines}`, leftColumnX, yPosition);
    yPosition += 6;
    
    // Right column - Project Information (if available)
    let rightY = metadataStartY;
    
    if (opts.projectData) {
      const projectData = opts.projectData;
      
      if (projectData.name) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Project:', rightColumnX, rightY);
        pdf.setFont(undefined, 'normal');
        const projectNameLines = pdf.splitTextToSize(projectData.name, (contentWidth / 2) - 40);
        pdf.text(projectNameLines, rightColumnX + 25, rightY);
        rightY += projectNameLines.length * 6 + 3;
      }
      
      if (projectData.manager) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Manager:', rightColumnX, rightY);
        pdf.setFont(undefined, 'normal');
        pdf.text(projectData.manager, rightColumnX + 25, rightY);
        rightY += 6;
      }
      
      if (projectData.budget) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Budget:', rightColumnX, rightY);
        pdf.setFont(undefined, 'normal');
        const budget = typeof projectData.budget === 'number' 
          ? `$${projectData.budget.toLocaleString()}` 
          : projectData.budget;
        pdf.text(budget, rightColumnX + 25, rightY);
        rightY += 6;
      }
    }
    
    // Published info if available
    if (report.publishedAt) {
      const publishDate = new Date(report.publishedAt).toLocaleDateString();
      pdf.text(`Published: ${publishDate}`, rightColumnX, rightY);
      rightY += 6;
    }
    
    // Adjust yPosition to the lower of the two columns
    yPosition = Math.max(yPosition, rightY) + 10;

    // Add horizontal line
    pdf.setLineWidth(0.8);
    pdf.setDrawColor(100, 100, 100);
    pdf.line(20, yPosition, 20 + contentWidth, yPosition);
    yPosition += 12;

    return yPosition;
  }

  /**
   * Add project information
   */
  addProjectInfo(pdf, projectData, yPosition, contentWidth, opts) {
    const { fontSize } = opts;
    
    pdf.setFontSize(fontSize.heading);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Project Information', 20, yPosition);
    yPosition += 12;

    pdf.setFontSize(fontSize.body);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);

    // Two-column layout for project info
    const leftColumnX = 20;
    const rightColumnX = 20 + (contentWidth / 2);
    const projectStartY = yPosition;
    
    // Left column
    if (projectData.name) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Project Name:', leftColumnX, yPosition);
      pdf.setFont(undefined, 'normal');
      const projectNameLines = pdf.splitTextToSize(projectData.name, (contentWidth / 2) - 20);
      pdf.text(projectNameLines, leftColumnX + 35, yPosition);
      yPosition += projectNameLines.length * 6 + 3;
    }


    if (projectData.description) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Description:', leftColumnX, yPosition);
      pdf.setFont(undefined, 'normal');
      const descLines = pdf.splitTextToSize(projectData.description, (contentWidth / 2) - 20);
      pdf.text(descLines, leftColumnX + 35, yPosition);
      yPosition += descLines.length * 6 + 3;
    }
    
    // Right column (reset Y position)
    let rightY = projectStartY;

    if (projectData.manager) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Project Manager:', rightColumnX, rightY);
      pdf.setFont(undefined, 'normal');
      pdf.text(projectData.manager, rightColumnX + 40, rightY);
      rightY += 8;
    }


    if (projectData.status) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Status:', rightColumnX, rightY);
      pdf.setFont(undefined, 'normal');
      pdf.text(projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1), rightColumnX + 40, rightY);
      rightY += 8;
    }

    if (projectData.budget) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Budget:', rightColumnX, rightY);
      pdf.setFont(undefined, 'normal');
      const budget = typeof projectData.budget === 'number' 
        ? `$${projectData.budget.toLocaleString()}` 
        : projectData.budget;
      pdf.text(budget, rightColumnX + 40, rightY);
      rightY += 8;
    }

    // Adjust yPosition to the lower of the two columns
    yPosition = Math.max(yPosition, rightY) + 12;

    // Add horizontal line
    pdf.setLineWidth(0.6);
    pdf.setDrawColor(100, 100, 100);
    pdf.line(20, yPosition, 20 + contentWidth, yPosition);
    yPosition += 12;

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
    
    // Line header - use custom title if available, otherwise fall back to Line number
    pdf.setFontSize(fontSize.heading);
    pdf.setFont(undefined, 'bold');
    const lineTitle = line.title && line.title.trim() ? line.title : `Line ${lineNumber}`;
    pdf.text(lineTitle, 20, yPosition);
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

    // Images - Horizontal Layout
    if (line.images && line.images.length > 0) {
      yPosition += 5;
      
      // Calculate optimal image sizing for horizontal layout
      const margin = opts.margin;
      const availableWidth = contentWidth;
      const minImageWidth = 25; // Minimum readable width in mm
      const maxImageHeight = 50; // Maximum height to maintain readability
      const imageSpacing = 3; // Space between images
      
      // Calculate how many images can fit per row
      const calculateImagesPerRow = (imageCount) => {
        if (imageCount === 1) return 1;
        if (imageCount === 2) return 2;
        if (imageCount === 3) return 3;
        if (imageCount === 4) return 2; // 2x2 grid works better than 4x1
        return Math.min(Math.floor(availableWidth / (minImageWidth + imageSpacing)), imageCount);
      };
      
      const imagesPerRow = calculateImagesPerRow(line.images.length);
      const imageWidth = (availableWidth - (imageSpacing * (imagesPerRow - 1))) / imagesPerRow;
      
      // Process images in rows
      for (let i = 0; i < line.images.length; i += imagesPerRow) {
        const rowImages = line.images.slice(i, i + imagesPerRow);
        let maxRowHeight = 0;
        const imagePositions = [];
        
        // Check if we need a new page for this row
        if (yPosition > pdf.internal.pageSize.getHeight() - (maxImageHeight + 50)) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // First pass: calculate dimensions and collect image data
        for (let j = 0; j < rowImages.length; j++) {
          const image = rowImages[j];
          const xPosition = margin + (j * (imageWidth + imageSpacing));
          
          try {
            let imageData = image.url;
            if (image.file) {
              imageData = await this.fileToBase64(image.file);
            }
            
            // Calculate image dimensions
            const img = new Image();
            img.src = imageData;
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                const aspectRatio = img.width / img.height;
                let finalHeight = imageWidth / aspectRatio;
                
                // Ensure height doesn't exceed maximum
                if (finalHeight > maxImageHeight) {
                  finalHeight = maxImageHeight;
                }
                
                maxRowHeight = Math.max(maxRowHeight, finalHeight);
                
                imagePositions.push({
                  x: xPosition,
                  y: yPosition,
                  width: imageWidth,
                  height: finalHeight,
                  data: imageData,
                  caption: image.caption
                });
                
                resolve();
              };
              img.onerror = () => {
                // Fallback for failed images
                const fallbackHeight = Math.min(imageWidth * 0.75, maxImageHeight);
                maxRowHeight = Math.max(maxRowHeight, fallbackHeight);
                
                imagePositions.push({
                  x: xPosition,
                  y: yPosition,
                  width: imageWidth,
                  height: fallbackHeight,
                  data: null,
                  caption: image.caption,
                  isPlaceholder: true
                });
                
                resolve();
              };
            });
          } catch (error) {
            console.error('Error processing image:', error);
            // Add placeholder for errored images
            const fallbackHeight = Math.min(imageWidth * 0.75, maxImageHeight);
            maxRowHeight = Math.max(maxRowHeight, fallbackHeight);
            
            imagePositions.push({
              x: xPosition,
              y: yPosition,
              width: imageWidth,
              height: fallbackHeight,
              data: null,
              caption: image.caption,
              isPlaceholder: true
            });
          }
        }
        
        // Second pass: render images
        for (const pos of imagePositions) {
          if (pos.isPlaceholder || !pos.data) {
            // Render placeholder
            pdf.setFillColor(240, 240, 240);
            pdf.rect(pos.x, pos.y, pos.width, pos.height, 'F');
            pdf.setFontSize(opts.fontSize.caption);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Image Preview', pos.x + 2, pos.y + pos.height/2);
            pdf.setTextColor(0, 0, 0); // Reset text color
          } else {
            // Render actual image
            try {
              pdf.addImage(pos.data, 'JPEG', pos.x, pos.y, pos.width, pos.height, undefined, 'FAST');
            } catch (imageError) {
              console.warn('Could not embed image, using placeholder:', imageError);
              // Fallback to placeholder
              pdf.setFillColor(240, 240, 240);
              pdf.rect(pos.x, pos.y, pos.width, pos.height, 'F');
              pdf.setFontSize(opts.fontSize.caption);
              pdf.text('Image Preview', pos.x + 2, pos.y + pos.height/2);
            }
          }
        }
        
        // Move Y position down by the maximum row height
        yPosition += maxRowHeight + 5;
        
        // Add captions below the row if any images have captions
        const captionedImages = imagePositions.filter(pos => pos.caption);
        if (captionedImages.length > 0) {
          pdf.setFontSize(opts.fontSize.caption);
          pdf.setFont(undefined, 'italic');
          
          for (const pos of captionedImages) {
            if (pos.caption) {
              const captionLines = pdf.splitTextToSize(pos.caption, pos.width);
              pdf.text(captionLines, pos.x, yPosition);
            }
          }
          
          // Add space for captions (assuming max 2 lines per caption)
          yPosition += (opts.fontSize.caption * 0.5 * 2) + 3;
        }
        
        yPosition += 5; // Space between rows
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