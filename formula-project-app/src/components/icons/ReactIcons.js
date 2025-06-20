/**
 * React Icons System for Formula PM
 * Construction-focused icon mappings using react-icons library
 * 
 * Libraries used:
 * - Font Awesome (fa) - Construction tools and industry icons
 * - Material Design (md) - UI navigation and controls
 * - Heroicons (hi) - Actions and interface elements
 * - Bootstrap (bs) - Additional utility icons
 */

import {
  // Construction & Tools (Font Awesome) - Using verified existing icons
  FaHammer,
  FaUser as FaHardHat, // Hard hat icon fallback (semantic placeholder)
  FaWrench,
  FaTools as FaScrewdriver, // Screwdriver fallback
  FaRuler,
  FaCompass as FaDraftingCompass, // Drafting compass fallback
  FaBuilding,
  FaBuilding as FaWarehouse, // Warehouse fallback
  FaBuilding as FaIndustry, // Industry fallback
  FaHome,
  FaTools,
  FaCog,
  FaClipboard,
  FaClipboard as FaClipboardCheck, // Clipboard check fallback
  FaCalendarAlt, // Correct FA5 name
  FaTasks,
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaTimes as FaTimesCircle, // Times circle fallback
  FaClock,
  FaExclamationTriangle, // Correct FA5 name
  FaInfoCircle,
  FaStar,
  FaStar as FaRegStar, // Regular star fallback
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaArrowUp as FaTrendingUp, // Trending up fallback
  FaFileAlt,
  FaFileAlt as FaFilePdf, // PDF file fallback
  FaFileAlt as FaFileExcel, // Excel file fallback
  FaImage,
  FaFolder,
  FaFolderOpen,
  FaDownload,
  FaUpload,
  FaShare,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaBell,
  FaBell as FaBellSlash, // Bell slash fallback
  FaSignOutAlt, // Correct FA5 name
  FaUserPlus,
  FaSun,
  FaMoon,
  FaMapMarkerAlt, // Correct FA5 name
  FaDollarSign,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaSave,
  FaUndo,
  FaSync,
  FaQuestionCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
  FaTimes,
  FaPlay,
  FaPause,
  FaStop
} from 'react-icons/fa';

import {
  // UI Navigation (Material Design)
  MdDashboard,
  MdSettings,
  MdApps,
  MdMoreVert,
  MdMoreHoriz,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdMenu,
  MdAccountCircle,
  MdHelp,
  MdRefresh,
  MdNotifications,
  MdNotificationsOff
} from 'react-icons/md';

import {
  // Actions (Heroicons)
  HiPlus,
  HiPencil,
  HiTrash,
  HiSave,
  HiDownload,
  HiUpload,
  HiDuplicate,
  HiRefresh,
  HiCog
} from 'react-icons/hi';

import {
  // Additional Icons (Bootstrap)
  BsGrid,
  BsList,
  BsTable,
  BsCalendar,
  BsKanban,
  BsGraphUp
} from 'react-icons/bs';

/**
 * Construction Industry Icon Mappings
 * Maps semantic names to appropriate React Icons
 */
export const ConstructionIcons = {
  // Project Types
  residential: FaHome,
  commercial: FaBuilding,
  industrial: FaIndustry,
  warehouse: FaWarehouse,
  
  // Construction Tools & Equipment
  hammer: FaHammer,
  hardhat: FaHardHat,
  wrench: FaWrench,
  screwdriver: FaScrewdriver,
  ruler: FaRuler,
  compass: FaDraftingCompass,
  tools: FaTools,
  
  // Project Management
  tasks: FaTasks,
  calendar: FaCalendarAlt,
  clipboard: FaClipboardCheck,
  timeline: FaChartLine,
  
  // Team & People
  team: FaUsers,
  user: FaUser,
  manager: FaUser,
  
  // Status Icons
  completed: FaCheckCircle,
  cancelled: FaTimesCircle,
  pending: FaClock,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
  
  // Quality & Safety
  approved: FaCheckCircle,
  rejected: FaTimesCircle,
  safety: FaHardHat
};

/**
 * Navigation Icon Mappings
 * For main application navigation
 */
export const NavigationIcons = {
  dashboard: MdDashboard,
  projects: FaBuilding,
  tasks: FaTasks,
  team: FaUsers,
  clients: FaUser,
  shopDrawings: FaRuler,
  materials: FaWarehouse,
  timeline: FaChartLine,
  procurement: FaShoppingCart,
  activityFeed: FaClipboardCheck,
  myWork: FaUser,
  settings: MdSettings,
  help: FaQuestionCircle
};

/**
 * Action Icon Mappings
 * For buttons and interactive elements
 */
export const ActionIcons = {
  add: HiPlus,
  edit: HiPencil,
  delete: HiTrash,
  save: HiSave,
  download: HiDownload,
  upload: HiUpload,
  search: FaSearch,
  filter: FaFilter,
  export: FaShare,
  share: FaShare,
  more: MdMoreVert,
  close: FaTimes,
  menu: MdMenu,
  refresh: FaSync,
  copy: HiDuplicate
};

/**
 * Status Icon Mappings
 * For indicating states and conditions
 */
export const StatusIcons = {
  success: FaCheckCircle,
  error: FaTimesCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
  pending: FaClock,
  inProgress: FaPlay,
  completed: FaCheckCircle,
  cancelled: FaTimesCircle,
  onHold: FaPause,
  star: FaStar,
  starOff: FaRegStar
};

/**
 * View Icon Mappings
 * For different display modes
 */
export const ViewIcons = {
  grid: BsGrid,
  list: BsList,
  table: BsTable,
  calendar: BsCalendar,
  board: BsKanban,
  timeline: BsGraphUp,
  visible: FaEye,
  hidden: FaEyeSlash
};

/**
 * File Icon Mappings
 * For document types
 */
export const FileIcons = {
  document: FaFileAlt,
  pdf: FaFilePdf,
  excel: FaFileExcel,
  image: FaImage,
  folder: FaFolder,
  folderOpen: FaFolderOpen,
  attachment: FaClipboardCheck
};

/**
 * Communication Icon Mappings
 */
export const CommunicationIcons = {
  email: FaEnvelope,
  phone: FaPhone,
  message: FaComments,
  notifications: FaBell,
  notificationsOff: FaBellSlash
};

/**
 * Chart Icon Mappings
 */
export const ChartIcons = {
  barChart: FaChartBar,
  pieChart: FaChartPie,
  lineChart: FaChartLine,
  trendingUp: FaTrendingUp
};

/**
 * Navigation Control Icons
 */
export const NavigationControlIcons = {
  arrowLeft: FaArrowLeft,
  arrowRight: FaArrowRight,
  arrowUp: FaArrowUp,
  arrowDown: FaArrowDown,
  chevronLeft: FaChevronLeft,
  chevronRight: FaChevronRight,
  chevronUp: FaChevronUp,
  chevronDown: FaChevronDown
};

/**
 * Master Icon Map
 * Combines all icon categories for easy access
 */
export const AllIcons = {
  ...ConstructionIcons,
  ...NavigationIcons,
  ...ActionIcons,
  ...StatusIcons,
  ...ViewIcons,
  ...FileIcons,
  ...CommunicationIcons,
  ...ChartIcons,
  ...NavigationControlIcons,
  
  // Additional utilities
  home: FaHome,
  locationOn: FaMapMarkerAlt,
  dateRange: FaCalendarAlt,
  monetizationOn: FaDollarSign,
  lightMode: FaSun,
  darkMode: FaMoon,
  logout: FaSignOutAlt,
  addUser: FaUserPlus,
  profile: FaUser
};

/**
 * Get icon component by name
 * @param {string} iconName - Icon name from AllIcons
 * @returns {React.Component|null} Icon component or null if not found
 */
export const getIcon = (iconName) => {
  return AllIcons[iconName] || null;
};

/**
 * Icon categories for organization
 */
export const IconCategories = {
  construction: Object.keys(ConstructionIcons),
  navigation: Object.keys(NavigationIcons),
  actions: Object.keys(ActionIcons),
  status: Object.keys(StatusIcons),
  views: Object.keys(ViewIcons),
  files: Object.keys(FileIcons),
  communication: Object.keys(CommunicationIcons),
  charts: Object.keys(ChartIcons)
};

/**
 * Helper function to get construction icon with configuration
 * Backward compatibility for components that used the old getConstructionIcon function
 * @param {string} iconName - Icon name
 * @param {string} category - Icon category (projectType, phase, quality, material, etc.)
 * @returns {object} Icon configuration object
 */
export const getConstructionIcon = (iconName, category = 'general') => {
  const categoryMaps = {
    projectType: {
      residential: { icon: ConstructionIcons.residential, label: 'Residential', color: '#2E7D32' },
      commercial: { icon: ConstructionIcons.commercial, label: 'Commercial', color: '#1976D2' },
      industrial: { icon: ConstructionIcons.industrial, label: 'Industrial', color: '#F57C00' },
      warehouse: { icon: ConstructionIcons.warehouse, label: 'Warehouse', color: '#455A64' }
    },
    phase: {
      planning: { icon: ConstructionIcons.ruler, label: 'Planning', color: '#1976D2' },
      construction: { icon: ConstructionIcons.hammer, label: 'Construction', color: '#F57C00' },
      finishing: { icon: ConstructionIcons.tools, label: 'Finishing', color: '#9C27B0' },
      completed: { icon: StatusIcons.completed, label: 'Completed', color: '#4CAF50' }
    },
    quality: {
      pending: { icon: StatusIcons.pending, label: 'Pending', color: '#FF9800' },
      approved: { icon: StatusIcons.approved, label: 'Approved', color: '#4CAF50' },
      rejected: { icon: StatusIcons.rejected, label: 'Rejected', color: '#F44336' }
    },
    material: {
      lumber: { icon: ConstructionIcons.tools, label: 'Lumber', color: '#8D6E63' },
      hardware: { icon: ConstructionIcons.wrench, label: 'Hardware', color: '#607D8B' },
      components: { icon: ConstructionIcons.tools, label: 'Components', color: '#FF7043' }
    },
    general: {
      tools: { icon: ConstructionIcons.tools, label: 'Tools', color: '#F57C00' },
      safety: { icon: ConstructionIcons.safety, label: 'Safety', color: '#FF5722' },
      building: { icon: ConstructionIcons.commercial, label: 'Building', color: '#1976D2' }
    }
  };

  const categoryMap = categoryMaps[category] || categoryMaps.general;
  const config = categoryMap[iconName] || categoryMap.tools || { 
    icon: ConstructionIcons.tools, 
    label: iconName, 
    color: '#666666' 
  };

  return {
    iconName: iconName,
    icon: config.icon,
    label: config.label,
    color: config.color,
    ...config
  };
};

export default AllIcons;