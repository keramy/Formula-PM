/**
 * Icon Mapping Service - Formula PM → Iconoir Migration
 * 
 * This service provides a centralized mapping from current icons
 * (Material-UI and React Icons) to Iconoir equivalents.
 */

import {
  // Navigation
  Home,
  Dashboard,
  Menu,
  Timeline,
  Folder,
  
  // Actions
  Plus,
  Search,
  Edit,
  Trash,
  Save,
  Filter,
  
  // Views  
  ViewGrid,
  Table,
  List,
  Calendar,
  
  // Status
  CheckCircle,
  Warning,
  XmarkCircle,
  InfoCircle,
  Star,
  
  // Business
  Building,
  User,
  Group,
  Settings,
  
  // Navigation arrows
  NavArrowUp,
  NavArrowDown,
  NavArrowLeft,
  NavArrowRight,
  
  // File operations
  Share,
  Download,
  Upload,
  
  // UI Controls
  MoreHoriz,
  
  // Additional icons
  Eye,
  EyeOff,
  Bell,
  Inbox,
  Check
} from 'iconoir-react';

/**
 * Complete icon mapping from current icons to Iconoir equivalents
 */
export const iconMap = {
  // ===== MATERIAL-UI ICONS MAPPING =====
  
  // Navigation
  'Home': Home,
  'Dashboard': Dashboard,
  'Menu': Menu,
  'Timeline': Timeline,
  'Folder': Folder,
  'FolderOpen': Folder, // Use same folder icon
  
  // Actions
  'Add': Plus,
  'Search': Search,
  'Edit': Edit,
  'Delete': Trash,
  'Save': Save,
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
  'Info': InfoCircle,
  
  // Business
  'Engineering': Building, // Alternative for engineering
  'Business': Building,
  'Assignment': Check, // Task assignment
  'Group': Group,
  'Person': User,
  
  // UI Controls
  'ExpandLess': NavArrowUp,
  'ExpandMore': NavArrowDown,
  'ChevronRight': NavArrowRight,
  'ChevronLeft': NavArrowLeft,
  'MoreHoriz': MoreHoriz,
  'Settings': Settings,
  
  // File operations
  'Share': Share,
  'GetApp': Download,
  'Upload': Upload,
  
  // Visibility
  'Visibility': Eye,
  'VisibilityOff': EyeOff,
  
  // Notifications
  'Notifications': Bell,
  'Inbox': Inbox,
  
  // ===== REACT ICONS MAPPING =====
  
  // FontAwesome icons (react-icons/fa)
  'FaSearch': Search,
  'FaPlus': Plus,
  'FaShare': Share,
  'FaEllipsisH': MoreHoriz,
  'FaStar': Star,
  'FaRegStar': Star, // Use same star icon
  'FaHome': Home,
  'FaBuilding': Building,
  'FaMoon': Cancel, // Will need custom dark mode icon
  'FaSun': Cancel, // Will need custom light mode icon  
  'FaCog': Settings,
  'FaUser': User,
  'FaSignOutAlt': Cancel, // Logout - use cancel as placeholder
  'FaHardHat': Building, // Construction theme
  'FaTools': Settings, // Tools icon alternative
  'FaHammer': Building, // Construction tool
  'FaFilter': Filter,
  'FaTimes': Cancel,
  'FaSave': Save,
  'FaCloudUploadAlt': Upload,
  'FaPaperclip': Upload, // Attachment
  'FaRedo': Cancel, // Refresh/redo
  'FaBug': Warning, // Bug report
  'FaArrowUp': NavArrowUp,
  'FaArrowDown': NavArrowDown,
  'FaChevronUp': NavArrowUp,
  'FaChevronDown': NavArrowDown,
  'FaCalendarAlt': Calendar,
  'FaTachometerAlt': Dashboard,
  'FaExclamationTriangle': Warning,
  'FaHistory': Cancel, // History - placeholder
  'FaThumbtack': Cancel, // Pin - placeholder
  
  // Ionic icons (react-icons/io5)
  'IoClose': Cancel,
  
  // Material Design icons (react-icons/md)
  'MdExpandMore': NavArrowDown
};

/**
 * Get Iconoir icon component by name
 * @param {string} iconName - Original icon name
 * @returns {React.Component} Iconoir icon component
 */
export const getIconoirIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    console.warn(`⚠️ Icon "${iconName}" not found in Iconoir mapping. Using default.`);
    return Cancel; // Default fallback icon
  }
  
  return IconComponent;
};

/**
 * Check if an icon has a direct Iconoir equivalent
 * @param {string} iconName - Original icon name
 * @returns {boolean} True if icon is mapped
 */
export const hasIconoirEquivalent = (iconName) => {
  return iconName in iconMap;
};

/**
 * Get all available Iconoir icons in this mapping
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
    console.log('📊 Iconoir Migration Status:', {
      totalMapped: Object.keys(iconMap).length,
      availableIcons: getAvailableIcons()
    });
  }
};

export default iconMap;