/**
 * Icon Mapping Service - Formula PM → React Icons/MD Migration
 * 
 * This service provides a centralized mapping from current icons
 * (Material-UI and React Icons) to react-icons/md equivalents.
 */

import {
  MdHome as Home,
  MdDashboard as Dashboard,
  MdMenu as Menu,
  MdTimeline as Timeline,
  MdFolder as Folder,
  MdAdd as Plus,
  MdSearch as Search,
  MdEdit as Edit,
  MdDelete as Trash,
  MdSave as FloppyDisk,
  MdArrowForward as ArrowRight,
  MdFilterList as Filter,
  MdViewModule as ViewGrid,
  MdTableRows as Table,
  MdList as List,
  MdCalendarToday as Calendar,
  MdCheckCircle as CheckCircle,
  MdWarning as Warning,
  MdError as XmarkCircle,
  MdCancel as Cancel,
  MdInfo as InfoCircle,
  MdStar as Star,
  MdBusiness as Building,
  MdPerson as User,
  MdGroup as Group,
  MdSettings as Settings,
  MdKeyboardArrowUp as NavArrowUp,
  MdExpandMore as NavArrowDown,
  MdArrowBack as NavArrowLeft,
  MdArrowForward as NavArrowRight,
  MdShare as Share,
  MdDownload as Download,
  MdCloudUpload as Upload,
  MdCloudUpload as CloudUpload,
  MdMoreHoriz as MoreHoriz,
  MdMoreVert as MoreVert,
  MdVisibility as Eye,
  MdVisibilityOff as EyeOff,
  MdNotifications as Bell,
  MdInbox as Inbox,
  MdCheck as Check,
  MdCancel as Cancel,
  MdDescription as Page,
  MdAssessment as StatsReport,
  MdLink as Link,
  MdArchive as Archive,
  MdLabel as TagOutline,
  MdHistory as HistoryCircle,
  MdKeyboardArrowDown as ArrowDown,
  MdFileDownload as DataTransferDown,
  MdFileUpload as DataTransferUp,
  MdZoomIn as ZoomIn,
  MdZoomOut as ZoomOut,
  MdFullscreen as Expand,
  MdPrint as Printer,
  MdRotateLeft as RotateLeft,
  MdRotateRight as RotateRight,
  MdShoppingCart as Cart,
  MdFormatQuote as Quote,
  MdLocalShipping as Delivery,
  MdAttachMoney as DollarCircle,
  MdTrendingUp as TrendingUp,
  MdPalette as Color,
  MdContentCopy as Copy,
  MdDesignServices as Design2D,
  MdLinkOff as Unlink,
  MdRemove as Minus,
  MdSecurity as ShieldCheck,
  MdEco as Leaf,
  MdPhone as Phone,
  MdEmail as Mail,
  MdUndo as Undo
} from 'react-icons/md';

/**
 * Complete icon mapping from current icons to react-icons/md equivalents
 */
export const iconMap = {
  // ===== MATERIAL-UI ICONS MAPPING =====
  
  // Navigation
  'Home': Home,
  'Dashboard': Dashboard,
  'Menu': Menu,
  'Timeline': Timeline,
  'Folder': Folder,
  'FolderOpen': Folder,
  
  // Actions
  'Add': Plus,
  'Search': Search,
  'Edit': Edit,
  'Delete': Trash,
  'Save': FloppyDisk,
  'Send': ArrowRight,
  'FilterList': Filter,
  
  // Views
  'ViewKanban': ViewGrid,
  'TableRows': Table,
  'ViewColumn': ViewGrid,
  'ViewModule': ViewGrid,
  'ViewList': List,
  'CalendarMonth': Calendar,
  
  // Status
  'CheckCircle': CheckCircle,
  'Warning': Warning,
  'Error': Cancel,
  'Cancel': Cancel,
  'Info': InfoCircle,
  
  // Business
  'Engineering': Building,
  'Business': Building,
  'Assignment': Check,
  'Group': Group,
  'Person': User,
  
  // UI Controls
  'ExpandLess': NavArrowUp,
  'ExpandMore': ArrowDown,
  'ChevronRight': NavArrowRight,
  'ChevronLeft': NavArrowLeft,
  'MoreHoriz': MoreHoriz,
  'MoreVert': MoreVert,
  'Settings': Settings,
  
  // File operations
  'Share': Share,
  'GetApp': Download,
  'Upload': Upload,
  'CloudUpload': CloudUpload,
  
  // PDF and documents
  'PictureAsPdf': Page,
  
  // Visibility
  'Visibility': Eye,
  'VisibilityOff': EyeOff,
  
  // Notifications
  'Notifications': Bell,
  'Inbox': Inbox,
  
  // History and version control
  'History': HistoryCircle,
  
  // Reports and analytics  
  'Assessment': StatsReport,
  'TableChart': DataTransferDown,
  
  // Linking and connections
  'Link': Link,
  
  // Inventory and categories
  'Category': TagOutline,
  'Inventory': Archive,
  
  // Additional comprehensive mappings
  'ZoomIn': ZoomIn,
  'ZoomOut': ZoomOut,
  'ZoomOutMap': Expand,
  'Fullscreen': Expand,
  'Print': Printer,
  'RotateLeft': RotateLeft,
  'RotateRight': RotateRight,
  'Close': Cancel,
  'ShoppingCart': Cart,
  'RequestQuote': Quote,
  'LocalShipping': Delivery,
  'AttachMoney': DollarCircle,
  'TrendingUp': TrendingUp,
  'Palette': Color,
  'FileCopy': Copy,
  'Architecture': Design2D,
  'LinkOff': Unlink,
  'Remove': Minus,
  'Security': ShieldCheck,
  'Gavel': ShieldCheck,
  'Eco': Leaf,
  'Phone': Phone,
  'Email': Mail,
  'Undo': Undo,
  'CalendarToday': Calendar,
  'ArrowBack': NavArrowLeft,
  
  // ===== REACT ICONS MAPPING =====
  
  // FontAwesome icons (react-icons/fa)
  'FaSearch': Search,
  'FaPlus': Plus,
  'FaShare': Share,
  'FaEllipsisH': MoreHoriz,
  'FaStar': Star,
  'FaRegStar': Star,
  'FaHome': Home,
  'FaBuilding': Building,
  'FaMoon': Cancel,
  'FaSun': Cancel,
  'FaCog': Settings,
  'FaUser': User,
  'FaSignOutAlt': Cancel,
  'FaHardHat': Building,
  'FaTools': Settings,
  'FaHammer': Building,
  'FaFilter': Filter,
  'FaTimes': Cancel,
  'FaSave': FloppyDisk,
  'FaCloudUploadAlt': Upload,
  'FaPaperclip': Upload,
  'FaRedo': Cancel,
  'FaBug': Warning,
  'FaArrowUp': NavArrowUp,
  'FaArrowDown': NavArrowDown,
  'FaChevronUp': NavArrowUp,
  'FaChevronDown': NavArrowDown,
  'FaCalendarAlt': Calendar,
  'FaTachometerAlt': Dashboard,
  'FaExclamationTriangle': Warning,
  'FaHistory': HistoryCircle,
  'FaThumbtack': Cancel,
  
  // Ionic icons (react-icons/io5)
  'IoClose': Cancel,
  
  // Material Design icons (react-icons/md)
  'MdExpandMore': NavArrowDown
};

/**
 * Get react-icons/md icon component by name
 * @param {string} iconName - Original icon name
 * @returns {React.Component} react-icons/md icon component
 */
export const getReactIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    console.warn(`⚠️ Icon "${iconName}" not found in react-icons/md mapping. Using default.`);
    return XmarkCircle;
  }
  
  return IconComponent;
};

/**
 * Check if an icon has a direct react-icons/md equivalent
 * @param {string} iconName - Original icon name
 * @returns {boolean} True if icon is mapped
 */
export const hasReactIconEquivalent = (iconName) => {
  return iconName in iconMap;
};

/**
 * Get all available react-icons/md icons in this mapping
 * @returns {string[]} Array of available icon names
 */
export const getAvailableIcons = () => {
  return Object.keys(iconMap);
};

/**
 * Migration helper - log missing icons during development
 */
export const logMissingIcons = () => {
  if (import.meta.env.MODE === 'development') {
    console.log('📊 react-icons/md Migration Status:', {
      totalMapped: Object.keys(iconMap).length,
      availableIcons: getAvailableIcons()
    });
  }
};

export default iconMap;