/**
 * Optimized Material-UI Icons
 * This file provides tree-shaken imports for commonly used icons
 * Reduces bundle size by only importing specific icons instead of the entire library
 */

// Dashboard and navigation icons
export { Dashboard } from '@mui/icons-material/Dashboard';
export { Projects } from '@mui/icons-material/Assignment';
export { Assignment as Tasks } from '@mui/icons-material/Assignment';
export { People as Team } from '@mui/icons-material/People';
export { Business as Clients } from '@mui/icons-material/Business';

// Action icons
export { Add } from '@mui/icons-material/Add';
export { Edit } from '@mui/icons-material/Edit';
export { Delete } from '@mui/icons-material/Delete';
export { MoreVert } from '@mui/icons-material/MoreVert';
export { Search } from '@mui/icons-material/Search';
export { Filter } from '@mui/icons-material/FilterList';
export { Export } from '@mui/icons-material/GetApp';
export { Close } from '@mui/icons-material/Close';
export { Save } from '@mui/icons-material/Save';

// Status and feedback icons
export { CheckCircle } from '@mui/icons-material/CheckCircle';
export { Error } from '@mui/icons-material/Error';
export { Warning } from '@mui/icons-material/Warning';
export { Info } from '@mui/icons-material/Info';
export { Star } from '@mui/icons-material/Star';
export { StarBorder } from '@mui/icons-material/StarBorder';

// Navigation icons
export { ArrowBack } from '@mui/icons-material/ArrowBack';
export { ArrowForward } from '@mui/icons-material/ArrowForward';
export { KeyboardArrowLeft } from '@mui/icons-material/KeyboardArrowLeft';
export { KeyboardArrowRight } from '@mui/icons-material/KeyboardArrowRight';
export { ExpandMore } from '@mui/icons-material/ExpandMore';
export { ExpandLess } from '@mui/icons-material/ExpandLess';

// View and display icons
export { ViewList } from '@mui/icons-material/ViewList';
export { ViewModule } from '@mui/icons-material/ViewModule';
export { TableChart } from '@mui/icons-material/TableChart';
export { Timeline } from '@mui/icons-material/Timeline';
export { Calendar } from '@mui/icons-material/CalendarToday';
export { Visibility } from '@mui/icons-material/Visibility';
export { VisibilityOff } from '@mui/icons-material/VisibilityOff';

// File and document icons
export { AttachFile } from '@mui/icons-material/AttachFile';
export { CloudDownload } from '@mui/icons-material/CloudDownload';
export { CloudUpload } from '@mui/icons-material/CloudUpload';
export { Description } from '@mui/icons-material/Description';
export { Folder } from '@mui/icons-material/Folder';
export { InsertDriveFile } from '@mui/icons-material/InsertDriveFile';

// Communication icons
export { Email } from '@mui/icons-material/Email';
export { Phone } from '@mui/icons-material/Phone';
export { Message } from '@mui/icons-material/Message';
export { Notifications } from '@mui/icons-material/Notifications';
export { NotificationsOff } from '@mui/icons-material/NotificationsOff';

// Project management specific icons
export { Build } from '@mui/icons-material/Build';
export { Construction } from '@mui/icons-material/Construction';
export { Engineering } from '@mui/icons-material/Engineering';
export { Architecture } from '@mui/icons-material/Architecture';
export { AccountBalance } from '@mui/icons-material/AccountBalance';
export { Handyman } from '@mui/icons-material/Handyman';

// Settings and configuration icons
export { Settings } from '@mui/icons-material/Settings';
export { Tune } from '@mui/icons-material/Tune';
export { Refresh } from '@mui/icons-material/Refresh';
export { Sync } from '@mui/icons-material/Sync';
export { Help } from '@mui/icons-material/Help';

// Progress and status indicators
export { Schedule } from '@mui/icons-material/Schedule';
export { PlayArrow } from '@mui/icons-material/PlayArrow';
export { Pause } from '@mui/icons-material/Pause';
export { Stop } from '@mui/icons-material/Stop';
export { PriorityHigh } from '@mui/icons-material/PriorityHigh';

// Chart and analytics icons
export { BarChart } from '@mui/icons-material/BarChart';
export { PieChart } from '@mui/icons-material/PieChart';
export { ShowChart } from '@mui/icons-material/ShowChart';
export { TrendingUp } from '@mui/icons-material/TrendingUp';
export { TrendingDown } from '@mui/icons-material/TrendingDown';

// Additional utility icons
export { Menu } from '@mui/icons-material/Menu';
export { Home } from '@mui/icons-material/Home';
export { LocationOn } from '@mui/icons-material/LocationOn';
export { DateRange } from '@mui/icons-material/DateRange';
export { AccessTime } from '@mui/icons-material/AccessTime';
export { MonetizationOn } from '@mui/icons-material/MonetizationOn';

/**
 * Icon mapping for dynamic icon selection
 * Maps string keys to icon components for dynamic usage
 */
export const IconMap = {
  // Dashboard
  dashboard: Dashboard,
  projects: Projects,
  tasks: Assignment,
  team: People,
  clients: Business,
  
  // Actions
  add: Add,
  edit: Edit,
  delete: Delete,
  more: MoreVert,
  search: Search,
  filter: Filter,
  export: Export,
  close: Close,
  save: Save,
  
  // Status
  success: CheckCircle,
  error: Error,
  warning: Warning,
  info: Info,
  star: Star,
  starBorder: StarBorder,
  
  // Navigation
  back: ArrowBack,
  forward: ArrowForward,
  left: KeyboardArrowLeft,
  right: KeyboardArrowRight,
  expandMore: ExpandMore,
  expandLess: ExpandLess,
  
  // Views
  list: ViewList,
  grid: ViewModule,
  table: TableChart,
  timeline: Timeline,
  calendar: Calendar,
  visible: Visibility,
  hidden: VisibilityOff,
  
  // Project types
  construction: Construction,
  engineering: Engineering,
  architecture: Architecture,
  management: AccountBalance,
  millwork: Handyman,
  electrical: Build,
  
  // Progress
  schedule: Schedule,
  play: PlayArrow,
  pause: Pause,
  stop: Stop,
  priority: PriorityHigh,
  
  // Charts
  bar: BarChart,
  pie: PieChart,
  line: ShowChart,
  trendUp: TrendingUp,
  trendDown: TrendingDown,
};

/**
 * Get icon component by string key
 * @param {string} iconKey - Key from IconMap
 * @returns {React.Component} Icon component or null
 */
export const getIcon = (iconKey) => {
  return IconMap[iconKey] || null;
};

export default IconMap;