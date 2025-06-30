import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  MdAdd as AddIcon,
  MdShoppingCart as ProcurementIcon,
  MdFormatQuote as QuoteIcon,
  MdCheck as OrderIcon,
  MdLocalShipping as DeliveryIcon,
  MdCheckCircle as CompleteIcon,
  MdWarning as WarningIcon,
  MdClose as ErrorIcon,
  MdCalendarToday as CalendarIcon,
  MdTimeline as TimelineIcon,
  MdAttachMoney as CostIcon,
  MdArchive as InventoryIcon,
  MdMoreVert as MoreVertIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdDownload as DownloadIcon,
  MdEmail as EmailIcon,
  MdExpandMore as ExpandMoreIcon,
  MdKeyboardArrowUp as ArrowUpIcon
} from 'react-icons/md';

const ProcurementWorkflow = ({ 
  specifications = [],
  onCreatePurchaseOrder,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [deliveryCalendar, setDeliveryCalendar] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newOrder, setNewOrder] = useState({
    specifications: [],
    vendor: '',
    priority: 'medium',
    requestedDelivery: '',
    notes: '',
    approvalRequired: true
  });

  // Mock procurement data
  useEffect(() => {
    setPurchaseOrders([
      {
        id: 'PO-001',
        orderNumber: 'PO-2024-001',
        vendor: 'Cabinet Works Inc',
        status: 'pending_approval',
        priority: 'high',
        totalAmount: 8500.00,
        requestedDate: '2024-03-20',
        expectedDelivery: '2024-04-15',
        actualDelivery: null,
        specifications: [
          { specId: 'spec-1', itemId: 'SPEC001', description: 'Upper Cabinet - 30" Wide', quantity: 4, unitCost: 450, totalCost: 1800 }
        ],
        workflow: [
          { stage: 'Created', status: 'completed', date: '2024-03-15', user: 'John Smith' },
          { stage: 'Vendor Quote', status: 'completed', date: '2024-03-16', user: 'Vendor Portal' },
          { stage: 'Manager Approval', status: 'pending', date: null, user: 'Sarah Wilson' },
          { stage: 'Purchase Order', status: 'pending', date: null, user: null },
          { stage: 'Production', status: 'pending', date: null, user: null },
          { stage: 'Delivery', status: 'pending', date: null, user: null }
        ],
        costBreakdown: {
          materials: 6500,
          labor: 1500,
          shipping: 300,
          taxes: 200
        }
      },
      {
        id: 'PO-002',
        orderNumber: 'PO-2024-002',
        vendor: 'Hardware Direct',
        status: 'in_production',
        priority: 'medium',
        totalAmount: 1080.00,
        requestedDate: '2024-03-18',
        expectedDelivery: '2024-03-25',
        actualDelivery: null,
        specifications: [
          { specId: 'spec-2', itemId: 'HW-001', description: 'Soft-close Drawer Slides', quantity: 24, unitCost: 45, totalCost: 1080 }
        ],
        workflow: [
          { stage: 'Created', status: 'completed', date: '2024-03-10', user: 'Mike Johnson' },
          { stage: 'Vendor Quote', status: 'completed', date: '2024-03-11', user: 'Vendor Portal' },
          { stage: 'Manager Approval', status: 'completed', date: '2024-03-12', user: 'Sarah Wilson' },
          { stage: 'Purchase Order', status: 'completed', date: '2024-03-13', user: 'System' },
          { stage: 'Production', status: 'in_progress', date: '2024-03-14', user: null },
          { stage: 'Delivery', status: 'pending', date: null, user: null }
        ],
        costBreakdown: {
          materials: 900,
          labor: 100,
          shipping: 50,
          taxes: 30
        }
      },
      {
        id: 'PO-003',
        orderNumber: 'PO-2024-003',
        vendor: 'Custom Millwork Co',
        status: 'delivered',
        priority: 'high',
        totalAmount: 3500.00,
        requestedDate: '2024-02-15',
        expectedDelivery: '2024-03-10',
        actualDelivery: '2024-03-08',
        specifications: [
          { specId: 'spec-3', itemId: 'METAL-001', description: 'Bar Top - Stainless Steel', quantity: 1, unitCost: 3500, totalCost: 3500 }
        ],
        workflow: [
          { stage: 'Created', status: 'completed', date: '2024-02-10', user: 'Lisa Chen' },
          { stage: 'Vendor Quote', status: 'completed', date: '2024-02-11', user: 'Vendor Portal' },
          { stage: 'Manager Approval', status: 'completed', date: '2024-02-12', user: 'Sarah Wilson' },
          { stage: 'Purchase Order', status: 'completed', date: '2024-02-13', user: 'System' },
          { stage: 'Production', status: 'completed', date: '2024-03-05', user: null },
          { stage: 'Delivery', status: 'completed', date: '2024-03-08', user: null }
        ],
        costBreakdown: {
          materials: 2800,
          labor: 500,
          shipping: 150,
          taxes: 50
        }
      }
    ]);

    setQuotes([
      {
        id: 'quote-1',
        vendor: 'Cabinet Works Inc',
        specifications: ['spec-1'],
        totalAmount: 8500,
        validUntil: '2024-04-01',
        status: 'pending',
        leadTime: '21 days',
        terms: 'Net 30',
        notes: 'Includes installation and finishing'
      },
      {
        id: 'quote-2',
        vendor: 'Alternative Cabinets',
        specifications: ['spec-1'],
        totalAmount: 7800,
        validUntil: '2024-03-28',
        status: 'alternative',
        leadTime: '28 days',
        terms: 'Net 30',
        notes: 'Competitive pricing, longer lead time'
      }
    ]);

    setDeliveryCalendar([
      {
        id: 'delivery-1',
        orderNumber: 'PO-2024-002',
        vendor: 'Hardware Direct',
        items: 'Soft-close Drawer Slides (24 pairs)',
        scheduledDate: '2024-03-25',
        status: 'scheduled',
        trackingNumber: 'HD-2024-5432'
      },
      {
        id: 'delivery-2',
        orderNumber: 'PO-2024-001',
        vendor: 'Cabinet Works Inc',
        items: 'Upper Cabinets (4 units)',
        scheduledDate: '2024-04-15',
        status: 'pending_schedule',
        trackingNumber: null
      }
    ]);
  }, []);

  const getStatusPalette = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'approved':
        return 'success';
      case 'in_progress':
      case 'in_production':
      case 'pending':
      case 'scheduled':
        return 'warning';
      case 'pending_approval':
      case 'pending_schedule':
        return 'info';
      case 'rejected':
      case 'cancelled':
      case 'delayed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CompleteIcon color="success" />;
      case 'in_progress':
      case 'in_production':
        return <CalendarIcon color="warning" />;
      case 'pending':
      case 'pending_approval':
        return <WarningIcon color="warning" />;
      case 'rejected':
      case 'cancelled':
        return <ErrorIcon color="error" />;
      default:
        return <CalendarIcon />;
    }
  };

  const getWorkflowProgress = (workflow) => {
    const completed = workflow.filter(step => step.status === 'completed').length;
    return (completed / workflow.length) * 100;
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getProcurementStats = () => {
    const total = purchaseOrders.length;
    const pending = purchaseOrders.filter(order => order.status.includes('pending')).length;
    const inProgress = purchaseOrders.filter(order => order.status.includes('production')).length;
    const completed = purchaseOrders.filter(order => order.status === 'delivered').length;
    const totalValue = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return { total, pending, inProgress, completed, totalValue };
  };

  const stats = getProcurementStats();

  const handleCreateOrder = () => {
    const order = {
      ...newOrder,
      id: `PO-${Date.now()}`,
      orderNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      status: 'pending_approval',
      totalAmount: newOrder.specifications.reduce((sum, spec) => sum + (spec.quantity * spec.unitCost), 0),
      workflow: [
        { stage: 'Created', status: 'completed', date: new Date().toISOString().split('T')[0], user: 'Current User' },
        { stage: 'Vendor Quote', status: 'pending', date: null, user: null },
        { stage: 'Manager Approval', status: 'pending', date: null, user: null },
        { stage: 'Purchase Order', status: 'pending', date: null, user: null },
        { stage: 'Production', status: 'pending', date: null, user: null },
        { stage: 'Delivery', status: 'pending', date: null, user: null }
      ]
    };
    
    setPurchaseOrders([order, ...purchaseOrders]);
    setOrderDialogOpen(false);
    setNewOrder({
      specifications: [], vendor: '', priority: 'medium', requestedDelivery: '', notes: '', approvalRequired: true
    });
  };

  const renderOrderCard = (order) => (
    <Card key={order.id} variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h6">{order.orderNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.vendor}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {getStatusIcon(order.status)}
              <Chip
                label={order.status.replace('_', ' ')}
                size="small"
                color={getStatusPalette(order.status)}
              />
              <Chip
                label={order.priority}
                size="small"
                color={order.priority === 'high' ? 'error' : order.priority === 'medium' ? 'warning' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary">
              ${order.totalAmount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Expected: {order.expectedDelivery}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Workflow Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getWorkflowProgress(order.workflow)}
            color={getWorkflowProgress(order.workflow) === 100 ? 'success' : 'primary'}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {order.workflow.filter(step => step.status === 'completed').length} of {order.workflow.length} steps completed
          </Typography>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              Specifications ({order.specifications.length} items)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {order.specifications.map((spec, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${spec.itemId} - ${spec.description}`}
                    secondary={`Qty: ${spec.quantity} × $${spec.unitCost} = $${spec.totalCost}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button size="small" variant="outlined" startIcon={<TimelineIcon />}>
            View Timeline
          </Button>
          <Button size="small" variant="outlined" startIcon={<EmailIcon />}>
            Contact Vendor
          </Button>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
            Export PO
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ProcurementIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={600}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main" fontWeight={600}>
                {stats.pending + stats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CompleteIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main" fontWeight={600}>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CostIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary.main" fontWeight={600}>
                ${stats.totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Procurement Workflow</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOrderDialogOpen(true)}
        >
          Create Purchase Order
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Purchase Orders" icon={<OrderIcon />} />
        <Tab label="Vendor Quotes" icon={<QuoteIcon />} />
        <Tab label="Delivery Calendar" icon={<DeliveryIcon />} />
      </Tabs>

      {/* Purchase Orders Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending_approval">Pending Approval</MenuItem>
                <MenuItem value="in_production">In Production</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Orders List */}
          <Grid container spacing={3}>
            {filteredOrders.map((order) => (
              <Grid item xs={12} lg={6} key={order.id}>
                {renderOrderCard(order)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Vendor Quotes Tab */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell><strong>Vendor</strong></TableCell>
                <TableCell><strong>Specifications</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Lead Time</strong></TableCell>
                <TableCell><strong>Valid Until</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id} hover>
                  <TableCell>{quote.vendor}</TableCell>
                  <TableCell>{quote.specifications.length} item(s)</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ${quote.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{quote.leadTime}</TableCell>
                  <TableCell>{quote.validUntil}</TableCell>
                  <TableCell>
                    <Chip
                      label={quote.status}
                      size="small"
                      color={getStatusPalette(quote.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Accept Quote
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delivery Calendar Tab */}
      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell><strong>Order Number</strong></TableCell>
                <TableCell><strong>Vendor</strong></TableCell>
                <TableCell><strong>Items</strong></TableCell>
                <TableCell><strong>Calendard Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Tracking</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryCalendar.map((delivery) => (
                <TableRow key={delivery.id} hover>
                  <TableCell>{delivery.orderNumber}</TableCell>
                  <TableCell>{delivery.vendor}</TableCell>
                  <TableCell>{delivery.items}</TableCell>
                  <TableCell>{delivery.scheduledDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={delivery.status.replace('_', ' ')}
                      size="small"
                      color={getStatusPalette(delivery.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {delivery.trackingNumber ? (
                      <Button size="small" variant="outlined">
                        {delivery.trackingNumber}
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Not available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Order Dialog */}
      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={newOrder.vendor}
                  onChange={(e) => setNewOrder({...newOrder, vendor: e.target.value})}
                  label="Vendor"
                >
                  <MenuItem value="Cabinet Works Inc">Cabinet Works Inc</MenuItem>
                  <MenuItem value="Hardware Direct">Hardware Direct</MenuItem>
                  <MenuItem value="Custom Millwork Co">Custom Millwork Co</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newOrder.priority}
                  onChange={(e) => setNewOrder({...newOrder, priority: e.target.value})}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requested Delivery Date"
                type="date"
                value={newOrder.requestedDelivery}
                onChange={(e) => setNewOrder({...newOrder, requestedDelivery: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                multiline
                rows={3}
                placeholder="Special instructions, requirements, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained"
            disabled={!newOrder.vendor}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProcurementWorkflow;