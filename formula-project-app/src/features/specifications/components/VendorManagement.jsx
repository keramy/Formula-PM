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
  Rating,
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
  Divider,
  Avatar
} from '@mui/material';
import {
  MdAdd as AddIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdMoreVert as MoreVertIcon,
  MdPhone as PhoneIcon,
  MdEmail as EmailIcon,
  MdBusiness as BusinessIcon,
  MdStar as StarIcon,
  MdPerson as ContactIcon
} from 'react-icons/md';

const VendorManagement = ({ 
  onVendorSelect, 
  selectedVendor,
  specifications = []
}) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addVendorDialogOpen, setAddVendorDialogOpen] = useState(false);
  const [editVendorDialogOpen, setEditVendorDialogOpen] = useState(false);
  const [selectedVendorData, setSelectedVendorData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newVendor, setNewVendor] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    specialties: [],
    rating: 0,
    leadTime: '',
    notes: '',
    certifications: [],
    status: 'active'
  });

  // Mock vendor data - in real app, this would come from API
  useEffect(() => {
    setVendors([
      {
        id: 'vendor-1',
        name: 'Cabinet Works Inc',
        contactPerson: 'John Smith',
        email: 'john@cabinetworks.com',
        phone: '(555) 123-4567',
        address: '123 Industrial Blvd, Manufacturing City, MC 12345',
        website: 'www.cabinetworks.com',
        specialties: ['Kitchen Cabinets', 'Bathroom Vanities', 'Custom Millwork'],
        rating: 4.8,
        leadTime: '14-21 days',
        notes: 'Excellent quality, reliable delivery',
        certifications: ['ISO 9001', 'GREENGUARD Gold'],
        status: 'active',
        totalOrders: 45,
        totalValue: 125000,
        onTimeDelivery: 94,
        lastOrder: '2024-03-15'
      },
      {
        id: 'vendor-2',
        name: 'Custom Millwork Co',
        contactPerson: 'Sarah Johnson',
        email: 'orders@custommillwork.com',
        phone: '(555) 234-5678',
        address: '456 Workshop Ave, Craft City, CC 23456',
        website: 'www.custommillwork.com',
        specialties: ['Reception Desks', 'Built-ins', 'Conference Tables'],
        rating: 4.5,
        leadTime: '21-28 days',
        notes: 'Specializes in complex custom pieces',
        certifications: ['FSC Certified', 'SCS Indoor Air Quality'],
        status: 'active',
        totalOrders: 23,
        totalValue: 89000,
        onTimeDelivery: 87,
        lastOrder: '2024-03-10'
      },
      {
        id: 'vendor-3',
        name: 'Hardware Direct',
        contactPerson: 'Mike Wilson',
        email: 'sales@hardwaredirect.com',
        phone: '(555) 345-6789',
        address: '789 Supply St, Hardware Town, HT 34567',
        website: 'www.hardwaredirect.com',
        specialties: ['Cabinet Hardware', 'Drawer Slides', 'Hinges'],
        rating: 4.3,
        leadTime: '5-7 days',
        notes: 'Fast shipping, competitive pricing',
        certifications: ['Quality Assurance Certified'],
        status: 'active',
        totalOrders: 67,
        totalValue: 34000,
        onTimeDelivery: 96,
        lastOrder: '2024-03-18'
      }
    ]);
  }, []);

  // Get unique specialties for filtering
  const specialties = ['all', ...new Set(vendors.flatMap(vendor => vendor.specialties))];

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || vendor.specialties.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleMenuOpen = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendorData(vendor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVendorData(null);
  };

  const handleAddVendor = () => {
    // In real app, would save to API
    const vendor = {
      ...newVendor,
      id: `vendor-${Date.now()}`,
      totalOrders: 0,
      totalValue: 0,
      onTimeDelivery: 0,
      lastOrder: null
    };
    
    setVendors([...vendors, vendor]);
    setAddVendorDialogOpen(false);
    setNewVendor({
      name: '', contactPerson: '', email: '', phone: '', address: '',
      website: '', specialties: [], rating: 0, leadTime: '', notes: '',
      certifications: [], status: 'active'
    });
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendorData(vendor);
    setEditVendorDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
    handleMenuClose();
  };

  const getPerformancePalette = (percentage) => {
    if (percentage >= 95) return 'success';
    if (percentage >= 85) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Vendor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddVendorDialogOpen(true)}
        >
          Add Vendor
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Specialty</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Filter by Specialty"
          >
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Vendor Cards */}
      <Grid container spacing={3}>
        {filteredVendors.map((vendor) => (
          <Grid item xs={12} md={6} lg={4} key={vendor.id}>
            <Card 
              elevation={selectedVendor?.id === vendor.id ? 3 : 1}
              sx={{ 
                height: '100%',
                cursor: onVendorSelect ? 'pointer' : 'default',
                border: selectedVendor?.id === vendor.id ? '2px solid' : '1px solid',
                borderColor: selectedVendor?.id === vendor.id ? 'primary.main' : 'divider'
              }}
              onClick={() => onVendorSelect && onVendorSelect(vendor)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {vendor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vendor.contactPerson}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, vendor);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Contact Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" noWrap>
                      {vendor.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {vendor.phone}
                    </Typography>
                  </Box>
                </Box>

                {/* Specialties */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Specialties:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {vendor.specialties.slice(0, 2).map((specialty) => (
                      <Chip
                        key={specialty}
                        label={specialty}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {vendor.specialties.length > 2 && (
                      <Chip
                        label={`+${vendor.specialties.length - 2} more`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>
                </Box>

                {/* Rating and Performance */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={vendor.rating} readOnly size="small" />
                      <Typography variant="body2">
                        {vendor.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">
                      On-time Delivery
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={`${getPerformancePalette(vendor.onTimeDelivery)}.main`}
                      fontWeight={600}
                    >
                      {vendor.onTimeDelivery}%
                    </Typography>
                  </Box>
                </Box>

                {/* Lead Time */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Lead Time: {vendor.leadTime}
                  </Typography>
                  <Chip
                    label={vendor.status}
                    size="small"
                    color={vendor.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditVendor(selectedVendorData)}>
          <EditIcon sx={{ mr: 1 }} /> Edit Vendor
        </MenuItem>
        <MenuItem onClick={() => handleDeleteVendor(selectedVendorData?.id)}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Vendor
        </MenuItem>
      </Menu>

      {/* Add Vendor Dialog */}
      <Dialog open={addVendorDialogOpen} onClose={() => setAddVendorDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={newVendor.contactPerson}
                onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newVendor.address}
                onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={newVendor.website}
                onChange={(e) => setNewVendor({...newVendor, website: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lead Time"
                value={newVendor.leadTime}
                onChange={(e) => setNewVendor({...newVendor, leadTime: e.target.value})}
                placeholder="e.g., 14-21 days"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialties (comma separated)"
                value={newVendor.specialties.join(', ')}
                onChange={(e) => setNewVendor({
                  ...newVendor, 
                  specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                placeholder="e.g., Kitchen Cabinets, Custom Millwork"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={newVendor.notes}
                onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVendorDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddVendor} 
            variant="contained"
            disabled={!newVendor.name}
          >
            Add Vendor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorManagement;