#!/bin/bash

# Icon Migration Script - Material UI to Iconoir React
# This script performs bulk find-and-replace operations

echo "🔧 Starting icon migration from Material-UI to iconoir-react..."

# Common Material-UI icon patterns to iconoir-react
find src -name "*.jsx" -type f -exec sed -i "
  s/from '@mui\/icons-material'/from 'iconoir-react'/g;
  s/Add as/Plus as/g;
  s/Search as/Search as/g;
  s/Edit as/Edit as/g;
  s/Delete as/Trash as/g;
  s/Save as/Save as/g;
  s/FilterList as/Filter as/g;
  s/Home as/Home as/g;
  s/Dashboard as/Dashboard as/g;
  s/Menu as/Menu as/g;
  s/Timeline as/Timeline as/g;
  s/Folder as/Folder as/g;
  s/FolderOpen as/Folder as/g;
  s/ViewKanban as/ViewGrid as/g;
  s/TableRows as/Table as/g;
  s/ViewColumn as/ViewGrid as/g;
  s/ViewModule as/ViewGrid as/g;
  s/ViewList as/List as/g;
  s/CalendarMonth as/Calendar as/g;
  s/CheckCircle as/CheckCircle as/g;
  s/Warning as/Warning as/g;
  s/Error as/Cancel as/g;
  s/Cancel as/Cancel as/g;
  s/Info as/InfoCircle as/g;
  s/Engineering as/Building as/g;
  s/Business as/Building as/g;
  s/Assignment as/Check as/g;
  s/Group as/Group as/g;
  s/Person as/User as/g;
  s/People as/Group as/g;
  s/ExpandLess as/ArrowUp as/g;
  s/ExpandMore as/ArrowDown as/g;
  s/ChevronRight as/NavArrowRight as/g;
  s/ChevronLeft as/NavArrowLeft as/g;
  s/MoreHoriz as/MoreHoriz as/g;
  s/MoreVert as/MoreVert as/g;
  s/Settings as/Settings as/g;
  s/Share as/Share as/g;
  s/GetApp as/Download as/g;
  s/Upload as/Upload as/g;
  s/CloudUpload as/CloudUpload as/g;
  s/PictureAsPdf as/Page as/g;
  s/Visibility as/Eye as/g;
  s/VisibilityOff as/EyeOff as/g;
  s/Notifications as/Bell as/g;
  s/NotificationsNone as/Bell as/g;
  s/Inbox as/Inbox as/g;
  s/History as/HistoryCircle as/g;
  s/Assessment as/StatsReport as/g;
  s/TableChart as/DataTransferDown as/g;
  s/Link as/Link as/g;
  s/Category as/TagOutline as/g;
  s/Inventory as/Archive as/g;
  s/ZoomIn as/ZoomIn as/g;
  s/ZoomOut as/ZoomOut as/g;
  s/ZoomOutMap as/Expand as/g;
  s/Fullscreen as/Expand as/g;
  s/Print as/Printer as/g;
  s/RotateLeft as/RotateLeft as/g;
  s/RotateRight as/RotateRight as/g;
  s/Close as/Cancel as/g;
  s/ShoppingCart as/Cart as/g;
  s/RequestQuote as/Quote as/g;
  s/LocalShipping as/Delivery as/g;
  s/AttachMoney as/DollarCircle as/g;
  s/TrendingUp as/TrendingUp as/g;
  s/Palette as/Color as/g;
  s/FileCopy as/Copy as/g;
  s/Architecture as/Design2D as/g;
  s/LinkOff as/Unlink as/g;
  s/Remove as/Minus as/g;
  s/Security as/ShieldCheck as/g;
  s/Gavel as/ShieldCheck as/g;
  s/Eco as/Leaf as/g;
  s/Phone as/Phone as/g;
  s/Email as/Mail as/g;
  s/Undo as/Undo as/g;
  s/CalendarToday as/Calendar as/g;
  s/ArrowBack as/ArrowLeft as/g;
  s/Refresh as/Refresh as/g;
  s/Check as/Check as/g;
  s/Clear as/Cancel as/g;
  s/Task as/Check as/g;
  s/Update as/Refresh as/g;
  s/Comment as/ChatBubble as/g;
  s/BugReport as/Warning as/g;
  s/Build as/Building as/g;
  s/Description as/Page as/g;
  s/Analytics as/StatsReport as/g;
  s/Replay as/Refresh as/g;
  s/Construction as/Building as/g;
  s/ArrowBack as/ArrowLeft as/g;
  s/AccountBalance as/Building as/g;
  s/Star as/Star as/g;
  s/StarBorder as/StarDashed as/g;
  s/Archive as/Archive as/g;
  s/Forward as/Forward as/g;
  s/Reply as/Reply as/g;
  s/Attachment as/Upload as/g;
  s/Send as/Send as/g;
  s/CheckCircle as/CheckCircle as/g;
  s/XmarkCircle as/Cancel as/g;
  s/Circle as/Circle as/g;
" {} \;

echo "✅ Icon migration completed!"
echo "📊 Summary:"
echo "   - Converted Material-UI icons to iconoir-react"
echo "   - Updated import statements"
echo "   - Mapped common icon patterns"

echo "🔍 Files updated:"
find src -name "*.jsx" -type f -exec grep -l "from 'iconoir-react'" {} \; | wc -l