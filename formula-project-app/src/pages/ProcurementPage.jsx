import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Badge
} from '@mui/material';
import {
  ShoppingCart as ProcurementIcon,
  Plus as AddIcon,
  Receipt as PurchaseOrderIcon,
  Building as VendorIcon,
  Analytics as AnalyticsIcon,
  Truck as DeliveryIcon,
  CheckCircle as ApprovedIcon,
  Clock as PendingIcon,
  AlertCircle as OverdueIcon,
  DollarSign as CostIcon,
  Trending as TrendIcon,
  Package as PackageIcon,
  Edit as EditIcon,
  Eye as ViewIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as EmailIcon,
  Star as StarIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon
} from 'iconoir-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import apiService from '../services/api/apiService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const ProcurementPage = () => {
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Data states
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materialSpecs, setMaterialSpecs] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Dialog states
  const [newPODialogOpen, setNewPODialogOpen] = useState(false);
  const [newVendorDialogOpen, setNewVendorDialogOpen] = useState(false);
  const [viewPODialogOpen, setViewPODialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    project: 'all',
    vendor: 'all',
    dateRange: 'all'
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [projectsData, specsData, teamData] = await Promise.all([
        apiService.getProjects(),
        apiService.getMaterialSpecifications(),
        apiService.getTeamMembers()
      ]);
      
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setMaterialSpecs(Array.isArray(specsData) ? specsData : []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);

      // Generate demo procurement data
      generateDemoProcurementData(projectsData, specsData);
      
      setError(null);
    } catch (err) {
      setError('Failed to load procurement data: ' + err.message);
      console.error('Error loading procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoProcurementData = (projectsData, specsData) => {
    // Generate demo purchase orders
    const demoPOs = [
      {
        id: 'PO-2024-001',
        projectId: projectsData[0]?.id || 'proj-1',
        projectName: projectsData[0]?.name || 'Downtown Office Complex',
        vendorId: 'vendor-1',
        vendorName: 'Premium Millwork Supply Co.',
        status: 'approved',
        orderDate: '2024-06-15',
        expectedDelivery: '2024-07-15',
        totalAmount: 45000,
        items: [
          { id: 1, name: 'Custom Oak Panels', quantity: 50, unitPrice: 650, total: 32500 },
          { id: 2, name: 'Brass Hardware Set', quantity: 25, unitPrice: 500, total: 12500 }
        ],
        approvedBy: user?.id || 'user-1',
        approvedDate: '2024-06-16',
        priority: 'high'
      },
      {
        id: 'PO-2024-002',
        projectId: projectsData[1]?.id || 'proj-2',
        projectName: projectsData[1]?.name || 'Luxury Residential',
        vendorId: 'vendor-2',
        vendorName: 'Elite Construction Materials',
        status: 'pending',
        orderDate: '2024-06-20',
        expectedDelivery: '2024-07-20',
        totalAmount: 28000,
        items: [
          { id: 1, name: 'Premium Hardwood Flooring', quantity: 100, unitPrice: 280, total: 28000 }
        ],
        priority: 'medium'
      },
      {
        id: 'PO-2024-003',
        projectId: projectsData[0]?.id || 'proj-1',
        projectName: projectsData[0]?.name || 'Downtown Office Complex',
        vendorId: 'vendor-3',
        vendorName: 'Industrial Hardware Solutions',
        status: 'delivered',
        orderDate: '2024-06-01',  
        expectedDelivery: '2024-06-25',
        actualDelivery: '2024-06-23',
        totalAmount: 15000,
        items: [
          { id: 1, name: 'Steel Brackets', quantity: 200, unitPrice: 75, total: 15000 }
        ],
        approvedBy: user?.id || 'user-1',
        approvedDate: '2024-06-02',
        priority: 'low'
      }
    ];

    // Generate demo vendors
    const demoVendors = [
      {
        id: 'vendor-1',
        name: 'Premium Millwork Supply Co.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@premiummill.com',
        phone: '+1 (555) 123-4567',
        address: '123 Industrial Drive, Portland, OR 97201',
        rating: 4.8,
        totalOrders: 15,
        onTimeDelivery: 95,
        qualityScore: 4.9,
        paymentTerms: 'Net 30',
        category: 'millwork',
        status: 'active',
        certifications: ['ISO 9001', 'FSC Certified']
      },
      {
        id: 'vendor-2',
        name: 'Elite Construction Materials',
        contactPerson: 'Michael Chen',
        email: 'michael@elitecm.com',
        phone: '+1 (555) 234-5678',
        address: '456 Commerce Blvd, Seattle, WA 98101',
        rating: 4.6,
        totalOrders: 22,
        onTimeDelivery: 88,
        qualityScore: 4.7,
        paymentTerms: 'Net 45',
        category: 'materials',
        status: 'active',
        certifications: ['LEED Certified']
      },
      {
        id: 'vendor-3',
        name: 'Industrial Hardware Solutions',
        contactPerson: 'David Wilson',
        email: 'david@ihsolutions.com',
        phone: '+1 (555) 345-6789',
        address: '789 Manufacturing Way, Vancouver, WA 98660',
        rating: 4.2,
        totalOrders: 8,
        onTimeDelivery: 92,
        qualityScore: 4.3,
        paymentTerms: 'Net 15',
        category: 'hardware',
        status: 'active',
        certifications: ['UL Listed']
      }
    ];

    // Generate demo deliveries
    const demoDeliveries = [
      {
        id: 'DEL-001',
        poId: 'PO-2024-001',
        status: 'in-transit',
        estimatedArrival: '2024-07-15',
        trackingNumber: 'TRK123456789',
        carrier: 'Premier Logistics',
        items: demoPOs[0].items
      },
      {
        id: 'DEL-002',
        poId: 'PO-2024-003',
        status: 'delivered',
        estimatedArrival: '2024-06-25',
        actualArrival: '2024-06-23',
        trackingNumber: 'TRK987654321',
        carrier: 'FastTrack Delivery',
        items: demoPOs[2].items
      }
    ];

    setPurchaseOrders(demoPOs);
    setVendors(demoVendors);
    setDeliveries(demoDeliveries);
  };

  // Calculate procurement statistics
  const procurementStats = useMemo(() => {
    const totalOrders = purchaseOrders.length;
    const totalAmount = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;
    const approvedOrders = purchaseOrders.filter(po => po.status === 'approved').length;
    const deliveredOrders = purchaseOrders.filter(po => po.status === 'delivered').length;
    const overdueDeliveries = purchaseOrders.filter(po => {
      if (po.status === 'delivered') return false;
      const expected = new Date(po.expectedDelivery);
      return expected < new Date();
    }).length;

    const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      totalAmount,
      pendingOrders,
      approvedOrders,
      deliveredOrders,
      overdueDeliveries,
      avgOrderValue,
      completionRate,
      activeVendors: vendors.filter(v => v.status === 'active').length
    };
  }, [purchaseOrders, vendors]);

  // Filtered data based on current filters
  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter(po => {
      if (filters.status !== 'all' && po.status !== filters.status) return false;
      if (filters.project !== 'all' && po.projectId !== filters.project) return false;
      if (filters.vendor !== 'all' && po.vendorId !== filters.vendor) return false;
      return true;
    });
  }, [purchaseOrders, filters]);

  // Event handlers
  const handleCreatePO = useCallback(() => {
    setNewPODialogOpen(true);
  }, []);

  const handleCreateVendor = useCallback(() => {
    setNewVendorDialogOpen(true);
  }, []);

  const handleViewPO = useCallback((po) => {
    setSelectedPO(po);
    setViewPODialogOpen(true);
  }, []);

  const handleApprovePO = useCallback(async (poId) => {
    try {
      // In a real app, this would call an API
      setPurchaseOrders(prev => prev.map(po => 
        po.id === poId 
          ? { ...po, status: 'approved', approvedBy: user?.id, approvedDate: new Date().toISOString() }
          : po
      ));
    } catch (error) {
      console.error('Error approving PO:', error);
      setError('Failed to approve purchase order');
    }
  }, [user]);

  const handleRejectPO = useCallback(async (poId) => {
    try {
      setPurchaseOrders(prev => prev.map(po => 
        po.id === poId ? { ...po, status: 'rejected' } : po
      ));
    } catch (error) {
      console.error('Error rejecting PO:', error);
      setError('Failed to reject purchase order');
    }
  }, []);

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <IconButton onClick={() => setFilterDialogOpen(true)}>
        <FilterIcon />
      </IconButton>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        size="small"
      >
        Import
      </Button>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        size="small"
      >
        Export
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreatePO}
      >
        New Purchase Order
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Purchase Orders" 
        isActive={activeTab === 'purchase-orders'}
        onClick={() => setActiveTab('purchase-orders')}
        icon={<PurchaseOrderIcon sx={{ fontSize: 16 }} />}
        badge={procurementStats.totalOrders}
      />
      <CleanTab 
        label="Vendor Management" 
        isActive={activeTab === 'vendor-management'}
        onClick={() => setActiveTab('vendor-management')}
        icon={<VendorIcon sx={{ fontSize: 16 }} />}
        badge={procurementStats.activeVendors}
      />
      <CleanTab 
        label="Cost Analysis" 
        isActive={activeTab === 'cost-analysis'}
        onClick={() => setActiveTab('cost-analysis')}
        icon={<AnalyticsIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Delivery Tracking" 
        isActive={activeTab === 'delivery-tracking'}
        onClick={() => setActiveTab('delivery-tracking')}
        icon={<DeliveryIcon sx={{ fontSize: 16 }} />}
        badge={procurementStats.overdueDeliveries > 0 ? procurementStats.overdueDeliveries : null}
      />
      <CleanTab 
        label="Pending Approval" 
        isActive={activeTab === 'pending-approval'}
        onClick={() => setActiveTab('pending-approval')}
        icon={<PendingIcon sx={{ fontSize: 16 }} />}
        badge={procurementStats.pendingOrders}
      />
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'purchase-orders':
        return (
          <PurchaseOrdersTab
            purchaseOrders={filteredPurchaseOrders}
            vendors={vendors}
            projects={projects}
            onViewPO={handleViewPO}
            onCreatePO={handleCreatePO}
            onApprovePO={handleApprovePO}
            onRejectPO={handleRejectPO}
          />
        );
      
      case 'vendor-management':
        return (
          <VendorManagementTab
            vendors={vendors}
            purchaseOrders={purchaseOrders}
            onCreateVendor={handleCreateVendor}
          />
        );
      
      case 'cost-analysis':
        return (
          <CostAnalysisTab
            purchaseOrders={purchaseOrders}
            projects={projects}
            vendors={vendors}
            stats={procurementStats}
          />
        );
      
      case 'delivery-tracking':
        return (
          <DeliveryTrackingTab
            deliveries={deliveries}
            purchaseOrders={purchaseOrders}
            vendors={vendors}
          />
        );
      
      case 'pending-approval':
        return (
          <PendingApprovalTab
            purchaseOrders={purchaseOrders.filter(po => po.status === 'pending')}
            vendors={vendors}
            projects={projects}
            onApprovePO={handleApprovePO}
            onRejectPO={handleRejectPO}
            onViewPO={handleViewPO}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <CleanPageLayout
      title="Procurement Management"
      subtitle="Comprehensive procurement system for construction materials, equipment, and services"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'Procurement', href: '/procurement' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Procurement Overview */}
        <ProcurementOverview stats={procurementStats} />

        {/* Tab Content */}
        {renderTabContent()}

        {/* Dialogs */}
        <NewPurchaseOrderDialog
          open={newPODialogOpen}
          onClose={() => setNewPODialogOpen(false)}
          projects={projects}
          vendors={vendors}
          materialSpecs={materialSpecs}
          onSubmit={(poData) => {
            // In a real app, this would call an API
            const newPO = {
              id: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
              ...poData,
              orderDate: new Date().toISOString().split('T')[0],
              status: 'pending'
            };
            setPurchaseOrders(prev => [newPO, ...prev]);
            setNewPODialogOpen(false);
          }}
        />

        <NewVendorDialog
          open={newVendorDialogOpen}
          onClose={() => setNewVendorDialogOpen(false)}
          onSubmit={(vendorData) => {
            const newVendor = {
              id: `vendor-${vendors.length + 1}`,
              ...vendorData,
              rating: 0,
              totalOrders: 0,
              onTimeDelivery: 0,
              qualityScore: 0,
              status: 'active'
            };
            setVendors(prev => [newVendor, ...prev]);
            setNewVendorDialogOpen(false);
          }}
        />

        <ViewPurchaseOrderDialog
          open={viewPODialogOpen}
          onClose={() => {
            setViewPODialogOpen(false);
            setSelectedPO(null);
          }}
          purchaseOrder={selectedPO}
          vendor={selectedPO ? vendors.find(v => v.id === selectedPO.vendorId) : null}
          project={selectedPO ? projects.find(p => p.id === selectedPO.projectId) : null}
        />

        <FilterDialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          projects={projects}
          vendors={vendors}
        />
      </Box>
    </CleanPageLayout>
  );
};

// Procurement Overview Component
const ProcurementOverview = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatsCard = ({ title, value, subtitle, icon, color = '#E3AF64', trend = null }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F1939',
                mb: 0.5
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: 24, color: color }
            })}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend > 0 ? (
              <ArrowUpIcon sx={{ fontSize: 16, color: '#10B981', mr: 0.5 }} />
            ) : (
              <ArrowDownIcon sx={{ fontSize: 16, color: '#EF4444', mr: 0.5 }} />
            )}
            <Typography variant="caption" sx={{ 
              color: trend > 0 ? '#10B981' : '#EF4444',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} lg={3}>
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.pendingOrders} pending approval`}
          icon={<PurchaseOrderIcon />}
          color="#516AC8"
          trend={12}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatsCard
          title="Total Value"
          value={formatCurrency(stats.totalAmount)}
          subtitle={`Avg ${formatCurrency(stats.avgOrderValue)} per order`}
          icon={<CostIcon />}
          color="#E3AF64"
          trend={8}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatsCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate)}%`}
          subtitle={`${stats.deliveredOrders} orders delivered`}
          icon={<ApprovedIcon />}
          color="#10B981"
          trend={5}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <StatsCard
          title="Active Vendors"
          value={stats.activeVendors}
          subtitle={stats.overdueDeliveries > 0 ? `${stats.overdueDeliveries} overdue deliveries` : 'All on track'}
          icon={<VendorIcon />}
          color={stats.overdueDeliveries > 0 ? "#EF4444" : "#516AC8"}
          trend={-2}
        />
      </Grid>
    </Grid>
  );
};

// Purchase Orders Tab Component
const PurchaseOrdersTab = ({ purchaseOrders, vendors, projects, onViewPO, onCreatePO, onApprovePO, onRejectPO }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      case 'delivered': return '#516AC8';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <ApprovedIcon sx={{ fontSize: 16 }} />;
      case 'pending': return <PendingIcon sx={{ fontSize: 16 }} />;
      case 'rejected': return <OverdueIcon sx={{ fontSize: 16 }} />;
      case 'delivered': return <PackageIcon sx={{ fontSize: 16 }} />;
      default: return <PendingIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0F1939', fontWeight: 600 }}>
          Purchase Orders ({purchaseOrders.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreatePO}
          sx={{ backgroundColor: '#E3AF64' }}
        >
          Create New Order
        </Button>
      </Box>

      <TableContainer component={Paper} className="clean-card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((po) => (
              <TableRow key={po.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#516AC8' }}>
                    {po.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#0F1939' }}>
                    {po.projectName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#0F1939' }}>
                    {po.vendorName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(po.status)}
                    label={po.status.replace('-', ' ').toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(po.status)}20`,
                      color: getStatusColor(po.status),
                      fontWeight: 600,
                      fontSize: '11px'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={po.priority.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${getPriorityColor(po.priority)}20`,
                      color: getPriorityColor(po.priority),
                      fontWeight: 500,
                      fontSize: '10px'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {format(new Date(po.orderDate), 'MMM dd, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {format(new Date(po.expectedDelivery), 'MMM dd, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F1939' }}>
                    {formatCurrency(po.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => onViewPO(po)}>
                      <ViewIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    {po.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => onApprovePO(po.id)}
                          sx={{ color: '#10B981' }}
                        >
                          <ApprovedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => onRejectPO(po.id)}
                          sx={{ color: '#EF4444' }}
                        >
                          <OverdueIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Vendor Management Tab Component
const VendorManagementTab = ({ vendors, purchaseOrders, onCreateVendor }) => {
  const getVendorOrders = (vendorId) => {
    return purchaseOrders.filter(po => po.vendorId === vendorId);
  };

  const getVendorRatingColor = (rating) => {
    if (rating >= 4.5) return '#10B981';
    if (rating >= 4.0) return '#E3AF64';
    if (rating >= 3.5) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0F1939', fontWeight: 600 }}>
          Vendor Directory ({vendors.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateVendor}
          sx={{ backgroundColor: '#E3AF64' }}
        >
          Add New Vendor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {vendors.map((vendor) => {
          const vendorOrders = getVendorOrders(vendor.id);
          const totalSpent = vendorOrders.reduce((sum, po) => sum + po.totalAmount, 0);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={vendor.id}>
              <Card className="clean-card" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#0F1939', mb: 0.5, fontSize: '16px' }}>
                        {vendor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                        {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                      </Typography>
                    </Box>
                    <Chip
                      label={vendor.status.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: vendor.status === 'active' ? '#10B98120' : '#6B728020',
                        color: vendor.status === 'active' ? '#10B981' : '#6B7280',
                        fontSize: '10px'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon sx={{ fontSize: 16, color: getVendorRatingColor(vendor.rating) }} />
                    <Typography variant="body2" sx={{ color: '#0F1939', fontWeight: 600 }}>
                      {vendor.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      ({vendor.totalOrders} orders)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                        {vendor.onTimeDelivery}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        On Time
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#E3AF64', fontWeight: 600 }}>
                        {vendor.qualityScore.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Quality
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#516AC8', fontWeight: 600 }}>
                        ${(totalSpent / 1000).toFixed(0)}K
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Total Spent
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <UserIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ color: '#0F1939' }}>
                        {vendor.contactPerson}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {vendor.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {vendor.phone}
                      </Typography>
                    </Box>
                  </Box>

                  {vendor.certifications && vendor.certifications.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6B7280', mb: 1, display: 'block' }}>
                        Certifications
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {vendor.certifications.map((cert, index) => (
                          <Chip
                            key={index}
                            label={cert}
                            size="small"
                            sx={{
                              backgroundColor: '#F6F3E7',
                              color: '#6B7280',
                              fontSize: '10px',
                              height: 20
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// Cost Analysis Tab Component
const CostAnalysisTab = ({ purchaseOrders, projects, vendors, stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate cost by project
  const costByProject = useMemo(() => {
    const projectCosts = {};
    purchaseOrders.forEach(po => {
      if (!projectCosts[po.projectId]) {
        projectCosts[po.projectId] = {
          name: po.projectName,
          totalCost: 0,
          orders: 0
        };
      }
      projectCosts[po.projectId].totalCost += po.totalAmount;
      projectCosts[po.projectId].orders += 1;
    });
    
    return Object.values(projectCosts).sort((a, b) => b.totalCost - a.totalCost);
  }, [purchaseOrders]);

  // Calculate cost by vendor
  const costByVendor = useMemo(() => {
    const vendorCosts = {};
    purchaseOrders.forEach(po => {
      if (!vendorCosts[po.vendorId]) {
        vendorCosts[po.vendorId] = {
          name: po.vendorName,
          totalCost: 0,
          orders: 0
        };
      }
      vendorCosts[po.vendorId].totalCost += po.totalAmount;
      vendorCosts[po.vendorId].orders += 1;
    });
    
    return Object.values(vendorCosts).sort((a, b) => b.totalCost - a.totalCost);
  }, [purchaseOrders]);

  // Monthly spending trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', spending: 65000, orders: 8 },
    { month: 'Feb', spending: 72000, orders: 12 },
    { month: 'Mar', spending: 58000, orders: 9 },
    { month: 'Apr', spending: 89000, orders: 15 },
    { month: 'May', spending: 76000, orders: 11 },
    { month: 'Jun', spending: 88000, orders: 13 }
  ];

  const statusDistribution = [
    { name: 'Approved', value: stats.approvedOrders, color: '#10B981' },
    { name: 'Pending', value: stats.pendingOrders, color: '#F59E0B' },
    { name: 'Delivered', value: stats.deliveredOrders, color: '#516AC8' }
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#0F1939', fontWeight: 600, mb: 3 }}>
        Cost Analysis & Budget Tracking
      </Typography>

      <Grid container spacing={3}>
        {/* Monthly Spending Trend */}
        <Grid item xs={12} lg={8}>
          <Card className="clean-card">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#0F1939' }}>
                Monthly Spending Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 12
                      }}
                      formatter={(value, name) => [
                        name === 'spending' ? formatCurrency(value) : value,
                        name === 'spending' ? 'Spending' : 'Orders'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#E3AF64" 
                      strokeWidth={3}
                      dot={{ fill: '#E3AF64', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Card className="clean-card">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#0F1939' }}>
                Order Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 12
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost by Project */}
        <Grid item xs={12} md={6}>
          <Card className="clean-card">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#0F1939' }}>
                Cost by Project
              </Typography>
              <List>
                {costByProject.slice(0, 5).map((project, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={project.name}
                      secondary={`${project.orders} orders`}
                      primaryTypographyProps={{ fontSize: '14px', color: '#0F1939' }}
                      secondaryTypographyProps={{ fontSize: '12px' }}
                    />
                    <Typography variant="body2" sx={{ color: '#516AC8', fontWeight: 600 }}>
                      {formatCurrency(project.totalCost)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost by Vendor */}
        <Grid item xs={12} md={6}>
          <Card className="clean-card">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#0F1939' }}>
                Top Vendors by Spending
              </Typography>
              <List>
                {costByVendor.slice(0, 5).map((vendor, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={vendor.name}
                      secondary={`${vendor.orders} orders`}
                      primaryTypographyProps={{ fontSize: '14px', color: '#0F1939' }}
                      secondaryTypographyProps={{ fontSize: '12px' }}
                    />
                    <Typography variant="body2" sx={{ color: '#E3AF64', fontWeight: 600 }}>
                      {formatCurrency(vendor.totalCost)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Delivery Tracking Tab Component
const DeliveryTrackingTab = ({ deliveries, purchaseOrders, vendors }) => {
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'in-transit': return '#E3AF64';
      case 'delayed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <PackageIcon sx={{ fontSize: 16 }} />;
      case 'in-transit': return <DeliveryIcon sx={{ fontSize: 16 }} />;
      case 'delayed': return <OverdueIcon sx={{ fontSize: 16 }} />;
      default: return <PendingIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#0F1939', fontWeight: 600, mb: 3 }}>
        Delivery Tracking ({deliveries.length})
      </Typography>

      <Grid container spacing={3}>
        {deliveries.map((delivery) => {
          const po = purchaseOrders.find(p => p.id === delivery.poId);
          const vendor = vendors.find(v => v.id === po?.vendorId);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={delivery.id}>
              <Card className="clean-card">
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#516AC8', fontSize: '14px', fontWeight: 600, mb: 0.5 }}>
                        {delivery.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0F1939', mb: 0.5 }}>
                        PO: {delivery.poId}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {vendor?.name}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getDeliveryStatusIcon(delivery.status)}
                      label={delivery.status.replace('-', ' ').toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${getDeliveryStatusColor(delivery.status)}20`,
                        color: getDeliveryStatusColor(delivery.status),
                        fontWeight: 600,
                        fontSize: '11px'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                      Tracking: {delivery.trackingNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                      Carrier: {delivery.carrier}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Expected: {format(new Date(delivery.estimatedArrival), 'MMM dd, yyyy')}
                    </Typography>
                    {delivery.actualArrival && (
                      <Typography variant="body2" sx={{ color: '#10B981' }}>
                        Delivered: {format(new Date(delivery.actualArrival), 'MMM dd, yyyy')}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1, fontWeight: 600 }}>
                      Items ({delivery.items.length})
                    </Typography>
                    {delivery.items.slice(0, 2).map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#0F1939', fontSize: '12px' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                    ))}
                    {delivery.items.length > 2 && (
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '11px' }}>
                        +{delivery.items.length - 2} more items
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// Pending Approval Tab Component
const PendingApprovalTab = ({ purchaseOrders, vendors, projects, onApprovePO, onRejectPO, onViewPO }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (purchaseOrders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ApprovedIcon sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#0F1939', mb: 1 }}>
          All Purchase Orders Approved
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          No purchase orders currently pending approval.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#0F1939', fontWeight: 600, mb: 3 }}>
        Pending Approval ({purchaseOrders.length})
      </Typography>

      <Grid container spacing={3}>
        {purchaseOrders.map((po) => {
          const vendor = vendors.find(v => v.id === po.vendorId);
          const project = projects.find(p => p.id === po.projectId);
          
          return (
            <Grid item xs={12} lg={6} key={po.id}>
              <Card className="clean-card" sx={{ border: '2px solid #F59E0B20' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#516AC8', fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                        {po.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0F1939', mb: 0.5 }}>
                        {po.projectName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {po.vendorName}
                      </Typography>
                    </Box>
                    <Chip
                      label={po.priority.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${getPriorityColor(po.priority)}20`,
                        color: getPriorityColor(po.priority),
                        fontWeight: 600,
                        fontSize: '11px'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        Order Date: {format(new Date(po.orderDate), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        Expected: {format(new Date(po.expectedDelivery), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: '#E3AF64', fontWeight: 600 }}>
                      {formatCurrency(po.totalAmount)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1, fontWeight: 600 }}>
                      Items ({po.items.length})
                    </Typography>
                    {po.items.slice(0, 2).map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#0F1939', fontSize: '13px' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </Typography>
                      </Box>
                    ))}
                    {po.items.length > 2 && (
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '11px' }}>
                        +{po.items.length - 2} more items
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => onViewPO(po)}
                      sx={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ApprovedIcon />}
                      onClick={() => onApprovePO(po.id)}
                      sx={{ 
                        backgroundColor: '#10B981',
                        '&:hover': { backgroundColor: '#059669' }
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OverdueIcon />}
                      onClick={() => onRejectPO(po.id)}
                      sx={{ 
                        color: '#EF4444',
                        borderColor: '#EF4444',
                        '&:hover': { backgroundColor: '#EF444420' }
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// Dialog Components will go here...
const NewPurchaseOrderDialog = ({ open, onClose, projects, vendors, materialSpecs, onSubmit }) => {
  // Implementation placeholder for now
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Purchase Order</DialogTitle>
      <DialogContent>
        <Typography>Purchase Order creation form will be implemented here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Create Order</Button>
      </DialogActions>
    </Dialog>
  );
};

const NewVendorDialog = ({ open, onClose, onSubmit }) => {
  // Implementation placeholder for now
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Vendor</DialogTitle>
      <DialogContent>
        <Typography>Vendor creation form will be implemented here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Add Vendor</Button>
      </DialogActions>
    </Dialog>
  );
};

const ViewPurchaseOrderDialog = ({ open, onClose, purchaseOrder, vendor, project }) => {
  // Implementation placeholder for now
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Purchase Order Details</DialogTitle>
      <DialogContent>
        <Typography>Purchase order details view will be implemented here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const FilterDialog = ({ open, onClose, filters, onFiltersChange, projects, vendors }) => {
  // Implementation placeholder for now
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Purchase Orders</DialogTitle>
      <DialogContent>
        <Typography>Filter options will be implemented here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Apply Filters</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcurementPage;