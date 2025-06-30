import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  MdAnalytics as ReportIcon,
  MdKeyboardArrowUp as ArrowUpIcon,
  MdAttachMoney as CostIcon,
  MdDashboard as PerformanceIcon,
  MdTimeline as TimelineIcon,
  MdPieChart as PieChartIcon,
  MdBarChart as BarChartIcon,
  MdDownload as DownloadIcon,
  MdEmail as EmailIcon,
  MdCalendarToday as CalendarIcon,
  MdCheckCircle as CompleteIcon,
  MdWarning as WarningIcon,
  MdEco as SustainabilityIcon,
  MdSecurity as ComplianceIcon,
  MdBusiness as VendorIcon,
  MdLabel as CategoryIcon
} from 'react-icons/md';

const MaterialSpecsReports = ({ 
  specifications = [],
  vendors = [],
  purchaseOrders = [],
  onGenerateReport,
  onCalendarReport,
  onExportData
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reportType, setReportType] = useState('cost_analysis');

  const [analyticsData, setAnalyticsData] = useState({});

  // Calculate analytics data
  useEffect(() => {
    const totalSpecs = specifications.length;
    const totalCost = specifications.reduce((sum, spec) => {
      const cost = typeof spec.totalCost === 'string' 
        ? parseFloat(spec.totalCost.replace(/[$,]/g, '')) 
        : parseFloat(spec.totalCost || 0);
      return sum + cost;
    }, 0);

    const avgCostPerSpec = totalSpecs > 0 ? totalCost / totalSpecs : 0;

    // Cost by category
    const costByCategory = specifications.reduce((acc, spec) => {
      const category = spec.category || 'Uncategorized';
      const cost = typeof spec.totalCost === 'string' 
        ? parseFloat(spec.totalCost.replace(/[$,]/g, '')) 
        : parseFloat(spec.totalCost || 0);
      acc[category] = (acc[category] || 0) + cost;
      return acc;
    }, {});

    // Specifications by status
    const specsByStatus = specifications.reduce((acc, spec) => {
      const status = spec.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Top categories by count
    const categoryCounts = specifications.reduce((acc, spec) => {
      const category = spec.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Vendor performance (mock data)
    const vendorPerformance = [
      { vendor: 'Cabinet Works Inc', orders: 15, onTime: 94, avgCost: 1250, rating: 4.8 },
      { vendor: 'Hardware Direct', orders: 28, onTime: 96, avgCost: 325, rating: 4.3 },
      { vendor: 'Custom Millwork Co', orders: 12, onTime: 87, avgCost: 2150, rating: 4.5 }
    ];

    // Compliance metrics (mock data)
    const complianceMetrics = {
      totalCompliant: Math.floor(totalSpecs * 0.75),
      pendingReview: Math.floor(totalSpecs * 0.15),
      nonCompliant: Math.floor(totalSpecs * 0.1),
      certificationRate: 85,
      sustainabilityRate: 72
    };

    // Cost trends (mock data)
    const costTrends = [
      { month: 'Jan', cost: 45000, savings: 5000 },
      { month: 'Feb', cost: 52000, savings: 6200 },
      { month: 'Mar', cost: 48000, savings: 7100 }
    ];

    setAnalyticsData({
      totalSpecs,
      totalCost,
      avgCostPerSpec,
      costByCategory,
      specsByStatus,
      categoryCounts,
      vendorPerformance,
      complianceMetrics,
      costTrends
    });
  }, [specifications]);

  const getStatusPalette = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPerformancePalette = (percentage) => {
    if (percentage >= 95) return 'success';
    if (percentage >= 85) return 'warning';
    return 'error';
  };

  const reportTypes = [
    { value: 'cost_analysis', label: 'Cost Analysis', icon: <CostIcon /> },
    { value: 'vendor_performance', label: 'Vendor Performance', icon: <VendorIcon /> },
    { value: 'compliance_status', label: 'Compliance Status', icon: <ComplianceIcon /> },
    { value: 'category_breakdown', label: 'Category Breakdown', icon: <CategoryIcon /> },
    { value: 'sustainability', label: 'Sustainability Report', icon: <SustainabilityIcon /> },
    { value: 'executive_summary', label: 'Executive Summary', icon: <ReportIcon /> }
  ];

  const periods = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'current_quarter', label: 'Current Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'current_year', label: 'Current Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const renderOverviewStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ReportIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={600}>
              {analyticsData.totalSpecs || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Specifications
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CostIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="primary.main" fontWeight={600}>
              ${(analyticsData.totalCost || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Value
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ArrowUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="success.main" fontWeight={600}>
              ${Math.round(analyticsData.avgCostPerSpec || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Cost per Spec
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CompleteIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="success.main" fontWeight={600}>
              {Math.round((analyticsData.complianceMetrics?.totalCompliant || 0) / 
                        (analyticsData.totalSpecs || 1) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compliance Rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCostAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cost by Category
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(analyticsData.costByCategory || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, cost]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{category}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${cost.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(cost / analyticsData.totalCost) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((cost / analyticsData.totalCost) * 100)}% of total
                  </Typography>
                </Box>
              ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cost Trends
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Alert severity="info" sx={{ mb: 2 }}>
              Cost optimization savings: $18,300 this quarter
            </Alert>
            {analyticsData.costTrends?.map((trend, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{trend.month}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${trend.cost.toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.main">
                  Savings: ${trend.savings.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderVendorPerformance = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell><strong>Vendor</strong></TableCell>
            <TableCell><strong>Orders</strong></TableCell>
            <TableCell><strong>On-Time Delivery</strong></TableCell>
            <TableCell><strong>Avg Order Value</strong></TableCell>
            <TableCell><strong>Rating</strong></TableCell>
            <TableCell><strong>Performance</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsData.vendorPerformance?.map((vendor) => (
            <TableRow key={vendor.vendor} hover>
              <TableCell>{vendor.vendor}</TableCell>
              <TableCell>{vendor.orders}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{vendor.onTime}%</Typography>
                  <Chip
                    label={vendor.onTime >= 95 ? 'Excellent' : vendor.onTime >= 85 ? 'Good' : 'Needs Improvement'}
                    size="small"
                    color={getPerformancePalette(vendor.onTime)}
                  />
                </Box>
              </TableCell>
              <TableCell>${vendor.avgCost.toLocaleString()}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2">{vendor.rating}</Typography>
                  <Typography variant="caption" color="text.secondary">★</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <LinearProgress
                  variant="determinate"
                  value={vendor.onTime}
                  color={getPerformancePalette(vendor.onTime)}
                  sx={{ width: 100 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderComplianceStatus = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Compliant</Typography>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  {analyticsData.complianceMetrics?.totalCompliant || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Pending Review</Typography>
                <Typography variant="body2" color="warning.main" fontWeight={600}>
                  {analyticsData.complianceMetrics?.pendingReview || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Non-Compliant</Typography>
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  {analyticsData.complianceMetrics?.nonCompliant || 0}
                </Typography>
              </Box>
            </Box>
            <Alert severity="success">
              Overall compliance rate: {analyticsData.complianceMetrics?.certificationRate || 0}%
            </Alert>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sustainability Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Sustainability Compliance
              </Typography>
              <LinearProgress
                variant="determinate"
                value={analyticsData.complianceMetrics?.sustainabilityRate || 0}
                color="success"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {analyticsData.complianceMetrics?.sustainabilityRate || 0}% of specifications meet sustainability standards
              </Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SustainabilityIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="FSC Certified Materials"
                  secondary="68% of wood products"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SustainabilityIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Low VOC Emissions"
                  secondary="85% compliance rate"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCategoryBreakdown = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Specifications by Category
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {Object.entries(analyticsData.categoryCounts || {})
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((count / analyticsData.totalSpecs) * 100)}% of total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Material Specifications Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => onCalendarReport && onCalendarReport(reportType)}
          >
            Calendar Report
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => onGenerateReport && onGenerateReport(reportType)}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            label="Report Type"
          >
            {reportTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {type.icon}
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            label="Time Period"
          >
            {periods.map((period) => (
              <MenuItem key={period.value} value={period.value}>
                {period.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category Filter</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category Filter"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Object.keys(analyticsData.categoryCounts || {}).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Overview Stats */}
      {renderOverviewStats()}

      {/* Content based on report type */}
      <Box>
        {reportType === 'cost_analysis' && renderCostAnalysis()}
        {reportType === 'vendor_performance' && renderVendorPerformance()}
        {reportType === 'compliance_status' && renderComplianceStatus()}
        {reportType === 'category_breakdown' && renderCategoryBreakdown()}
        {reportType === 'sustainability' && renderComplianceStatus()}
        {reportType === 'executive_summary' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderCostAnalysis()}
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              {renderVendorPerformance()}
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Export Options */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Export Options
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export as PDF
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export as Excel
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export as CSV
            </Button>
            <Button variant="outlined" startIcon={<EmailIcon />}>
              Email Report
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaterialSpecsReports;