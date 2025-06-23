/**
 * Optimized React Icons
 * This file provides tree-shaken imports for commonly used icons
 * Uses react-icons/fa for better performance and consistency
 */

import {
  FaTachometerAlt,
  FaClipboardList,
  FaUsers,
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaFilter,
  FaDownload,
  FaTimes,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaStar,
  FaRegStar,
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaTh,
  FaTable,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaPaperclip,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaFileAlt,
  FaFolder,
  FaFile,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaBell,
  FaBellSlash,
  FaWrench,
  FaCog,
  FaHome,
  FaSignOutAlt
} from 'react-icons/fa';

// Dashboard and navigation icons
export const Dashboard = FaTachometerAlt;
export const Projects = FaClipboardList;
export const Tasks = FaClipboardList;
export const Team = FaUsers;
export const Clients = FaBuilding;

// Action icons
export const Add = FaPlus;
export const Edit = FaEdit;
export const Delete = FaTrash;
export const MoreVert = FaEllipsisV;
export const Search = FaSearch;
export const Filter = FaFilter;
export const Export = FaDownload;
export const Close = FaTimes;
export const Save = FaSave;

// Status and feedback icons
export const CheckCircle = FaCheckCircle;
export const Error = FaExclamationCircle;
export const Warning = FaExclamationTriangle;
export const Info = FaInfoCircle;
export const Star = FaStar;
export const StarBorder = FaRegStar;

// Navigation icons
export const ArrowBack = FaArrowLeft;
export const ArrowForward = FaArrowRight;
export const KeyboardArrowLeft = FaChevronLeft;
export const KeyboardArrowRight = FaChevronRight;
export const ExpandMore = FaChevronDown;
export const ExpandLess = FaChevronUp;

// View and display icons
export const ViewList = FaList;
export const ViewModule = FaTh;
export const TableChart = FaTable;
export const Timeline = FaCalendarAlt;
export const Calendar = FaCalendarAlt;
export const Visibility = FaEye;
export const VisibilityOff = FaEyeSlash;

// File and document icons
export const AttachFile = FaPaperclip;
export const CloudDownload = FaCloudDownloadAlt;
export const CloudUpload = FaCloudUploadAlt;
export const Description = FaFileAlt;
export const Folder = FaFolder;
export const InsertDriveFile = FaFile;

// Communication icons
export const Email = FaEnvelope;
export const Phone = FaPhone;
export const Message = FaComments;
export const Notifications = FaBell;
export const NotificationsOff = FaBellSlash;

// Project management specific icons
export const Build = FaWrench;
export const Settings = FaCog;
export const Home = FaHome;
export const Logout = FaSignOutAlt;