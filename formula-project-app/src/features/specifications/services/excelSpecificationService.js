import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

class ExcelSpecificationService {
  constructor() {
    this.templateHeaders = [
      'Item ID',
      'Description',
      'Category',
      'Material',
      'Finish',
      'Hardware',
      'Dimensions (W x D x H)',
      'Quantity',
      'Unit',
      'Unit Cost',
      'Total Cost',
      'Supplier',
      'Part Number',
      'Lead Time (days)',
      'Notes',
      'Drawing Reference',
      'Room/Location',
      'Installation Phase'
    ];
  }

  // Generate Excel template for material specifications
  generateTemplate() {
    const workbook = XLSX.utils.book_new();

    // Create main specifications sheet
    const specsData = [
      this.templateHeaders,
      // Add sample data rows
      [
        'SPEC001',
        'Upper Cabinet - 30" Wide',
        'Kitchen Cabinets',
        'Maple Hardwood',
        'Natural Stain',
        'Soft-close hinges, adjustable shelves',
        '30" x 12" x 36"',
        '4',
        'EA',
        '$450.00',
        '$1,800.00',
        'Cabinet Works Inc',
        'UC-30-NAT',
        '14',
        'Pre-finished, ready to install',
        'Kitchen_Cabinets_Rev_C.pdf',
        'Kitchen',
        'Phase 2'
      ],
      [
        'SPEC002',
        'Base Cabinet with Drawers',
        'Kitchen Cabinets',
        'Maple Hardwood',
        'Natural Stain',
        'Soft-close drawers, full extension slides',
        '24" x 24" x 34.5"',
        '6',
        'EA',
        '$650.00',
        '$3,900.00',
        'Cabinet Works Inc',
        'BC-24-3DR',
        '14',
        'Includes toe kick and crown molding',
        'Kitchen_Cabinets_Rev_C.pdf',
        'Kitchen',
        'Phase 2'
      ],
      [
        'SPEC003',
        'Reception Desk - Custom',
        'Reception Furniture',
        'White Oak Veneer',
        'Clear Lacquer',
        'Wire management, LED strip lighting',
        '96" x 30" x 42"',
        '1',
        'EA',
        '$2,800.00',
        '$2,800.00',
        'Custom Millwork Co',
        'RD-96-WO',
        '21',
        'Curved front edge, integrated cable management',
        'Reception_Desk_Rev_B.pdf',
        'Reception',
        'Phase 1'
      ]
    ];

    const specsSheet = XLSX.utils.aoa_to_sheet(specsData);
    
    // Set column widths
    specsSheet['!cols'] = [
      { wch: 12 }, // Item ID
      { wch: 25 }, // Description
      { wch: 18 }, // Category
      { wch: 18 }, // Material
      { wch: 15 }, // Finish
      { wch: 30 }, // Hardware
      { wch: 20 }, // Dimensions
      { wch: 10 }, // Quantity
      { wch: 8 },  // Unit
      { wch: 12 }, // Unit Cost
      { wch: 12 }, // Total Cost
      { wch: 20 }, // Supplier
      { wch: 15 }, // Part Number
      { wch: 12 }, // Lead Time
      { wch: 30 }, // Notes
      { wch: 25 }, // Drawing Reference
      { wch: 15 }, // Room/Location
      { wch: 15 }  // Installation Phase
    ];

    XLSX.utils.book_append_sheet(workbook, specsSheet, 'Material Specifications');

    // Create categories reference sheet
    const categoriesData = [
      ['Category', 'Description', 'Typical Lead Time'],
      ['Kitchen Cabinets', 'Custom millwork for kitchen areas', '14-21 days'],
      ['Bathroom Vanities', 'Vanity cabinets and countertops', '10-14 days'],
      ['Reception Furniture', 'Front desk and seating areas', '21-28 days'],
      ['Office Built-ins', 'Custom shelving and storage', '14-21 days'],
      ['Conference Tables', 'Meeting room furniture', '21-28 days'],
      ['Wall Panels', 'Decorative and functional wall treatments', '10-14 days'],
      ['Trim and Molding', 'Finishing carpentry elements', '7-10 days']
    ];

    const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
    categoriesSheet['!cols'] = [
      { wch: 20 },
      { wch: 40 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');

    // Create suppliers reference sheet
    const suppliersData = [
      ['Supplier Name', 'Contact', 'Specialties', 'Lead Time', 'Quality Rating'],
      ['Cabinet Works Inc', 'john@cabinetworks.com', 'Kitchen & Bath Cabinets', '14 days', '★★★★★'],
      ['Custom Millwork Co', 'orders@custommillwork.com', 'Reception Desks, Built-ins', '21 days', '★★★★☆'],
      ['Hardwood Specialists', 'sales@hardwoodspec.com', 'Solid Wood Furniture', '28 days', '★★★★★'],
      ['Modern Fixtures LLC', 'info@modernfixtures.com', 'Hardware & Accessories', '7 days', '★★★★☆']
    ];

    const suppliersSheet = XLSX.utils.aoa_to_sheet(suppliersData);
    suppliersSheet['!cols'] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, suppliersSheet, 'Suppliers');

    return workbook;
  }

  // Export template to file
  exportTemplate(projectName = 'Project') {
    const workbook = this.generateTemplate();
    const fileName = `${projectName}_Material_Specifications_Template.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  // Parse uploaded Excel file
  async parseSpecificationsFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet (Material Specifications)
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('File appears to be empty or invalid'));
            return;
          }

          // Parse headers and data
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          // Validate headers
          const requiredHeaders = ['Item ID', 'Description', 'Category'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required headers: ${missingHeaders.join(', ')}`));
            return;
          }

          // Convert to specification objects
          const specifications = rows
            .filter(row => row.length > 0 && row[0]) // Filter out empty rows
            .map((row, index) => {
              const spec = {};
              headers.forEach((header, i) => {
                spec[this.normalizeHeaderName(header)] = row[i] || '';
              });
              
              // Add metadata
              spec.id = spec.itemId || `SPEC${String(index + 1).padStart(3, '0')}`;
              spec.importDate = new Date().toISOString();
              spec.status = 'imported';
              
              return spec;
            });

          resolve({
            specifications,
            metadata: {
              fileName: file.name,
              importDate: new Date().toISOString(),
              totalRows: specifications.length,
              headers
            }
          });
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Export specifications to Excel
  exportSpecifications(specifications, projectName = 'Project') {
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    const exportData = [
      this.templateHeaders,
      ...specifications.map(spec => [
        spec.itemId || spec.id,
        spec.description,
        spec.category,
        spec.material,
        spec.finish,
        spec.hardware,
        spec.dimensions,
        spec.quantity,
        spec.unit,
        spec.unitCost,
        spec.totalCost,
        spec.supplier,
        spec.partNumber,
        spec.leadTime,
        spec.notes,
        spec.drawingReference,
        spec.roomLocation,
        spec.installationPhase
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 }, { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 15 },
      { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 12 },
      { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 30 },
      { wch: 25 }, { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Material Specifications');

    // Export to file
    const fileName = `${projectName}_Material_Specifications_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  // Generate cost summary report
  generateCostSummary(specifications, projectName = 'Project') {
    const workbook = XLSX.utils.book_new();

    // Calculate summary by category
    const summaryByCategory = {};
    let totalProjectCost = 0;

    specifications.forEach(spec => {
      const category = spec.category || 'Uncategorized';
      const cost = parseFloat(spec.totalCost?.replace(/[$,]/g, '') || 0);
      
      if (!summaryByCategory[category]) {
        summaryByCategory[category] = {
          itemCount: 0,
          totalCost: 0,
          items: []
        };
      }
      
      summaryByCategory[category].itemCount++;
      summaryByCategory[category].totalCost += cost;
      summaryByCategory[category].items.push(spec);
      totalProjectCost += cost;
    });

    // Create summary sheet
    const summaryData = [
      ['Category Summary', '', '', ''],
      ['Category', 'Item Count', 'Total Cost', 'Percentage'],
      ...Object.entries(summaryByCategory).map(([category, data]) => [
        category,
        data.itemCount,
        `$${data.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        `${((data.totalCost / totalProjectCost) * 100).toFixed(1)}%`
      ]),
      ['', '', '', ''],
      ['Total Project Cost', '', `$${totalProjectCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '100%']
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Cost Summary');

    // Export to file
    const fileName = `${projectName}_Cost_Summary_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  // Utility method to normalize header names
  normalizeHeaderName(header) {
    return header
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/^([a-z])/, (match, p1) => p1.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1$2');
  }

  // Validate specification data
  validateSpecification(spec) {
    const errors = [];
    
    if (!spec.itemId) errors.push('Item ID is required');
    if (!spec.description) errors.push('Description is required');
    if (!spec.category) errors.push('Category is required');
    
    // Validate numeric fields
    if (spec.quantity && isNaN(parseFloat(spec.quantity))) {
      errors.push('Quantity must be a valid number');
    }
    
    if (spec.unitCost && isNaN(parseFloat(spec.unitCost.replace(/[$,]/g, '')))) {
      errors.push('Unit Cost must be a valid number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get template structure for API
  getTemplateStructure() {
    return {
      headers: this.templateHeaders,
      sampleData: {
        itemId: 'SPEC001',
        description: 'Sample Item Description',
        category: 'Kitchen Cabinets',
        material: 'Maple Hardwood',
        finish: 'Natural Stain',
        hardware: 'Soft-close hinges',
        dimensions: '30" x 12" x 36"',
        quantity: '1',
        unit: 'EA',
        unitCost: '$450.00',
        totalCost: '$450.00',
        supplier: 'Cabinet Works Inc',
        partNumber: 'UC-30-NAT',
        leadTime: '14',
        notes: 'Pre-finished, ready to install',
        drawingReference: 'Kitchen_Cabinets_Rev_C.pdf',
        roomLocation: 'Kitchen',
        installationPhase: 'Phase 2'
      }
    };
  }
}

// Export singleton instance
const excelSpecificationService = new ExcelSpecificationService();
export default excelSpecificationService;