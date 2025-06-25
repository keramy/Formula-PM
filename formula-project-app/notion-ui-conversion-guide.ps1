# Notion UI Conversion Guide for Formula PM
# PowerShell script to help convert your construction management app to Notion-style UI

Write-Host "🎨 Formula PM - Notion UI Conversion Guide" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Your Current Setup Status:" -ForegroundColor Green
Write-Host "✅ NotionStyleSidebar - Already implemented" -ForegroundColor Green  
Write-Host "✅ CleanPageLayout - Already created" -ForegroundColor Green
Write-Host "✅ Clean UI CSS - Already imported" -ForegroundColor Green
Write-Host "✅ Color palette - Construction-focused colors ready" -ForegroundColor Green

Write-Host ""
Write-Host "🔄 Pages That Need Conversion:" -ForegroundColor Yellow

$pagesToConvert = @(
    "Projects Overview Page",
    "All Projects List", 
    "Tasks Management",
    "Team Members",
    "Clients Management",
    "Shop Drawings",
    "Material Specifications",
    "Timeline & Gantt",
    "Reports Dashboard"
)

foreach ($page in $pagesToConvert) {
    Write-Host "   □ $page" -ForegroundColor White
}

Write-Host ""
Write-Host "🛠️  Quick Conversion Pattern:" -ForegroundColor Magenta
Write-Host ""

Write-Host "1. WRAP WITH CleanPageLayout:" -ForegroundColor Yellow
Write-Host @"
   // Old structure
   <Box sx={{ p: 3 }}>
     <Typography variant="h4">Page Title</Typography>
     <Button>Add Item</Button>
     {/* content */}
   </Box>

   // New structure  
   <CleanPageLayout
     title="Page Title"
     subtitle="Page description for construction teams"
     headerActions={headerActions}
     tabs={tabs}
   >
     {/* content with clean classes */}
   </CleanPageLayout>
"@ -ForegroundColor Gray

Write-Host ""
Write-Host "2. UPDATE COMPONENT CLASSES:" -ForegroundColor Yellow

$classReplacements = @{
    "<Card>" = "<Card className=`"clean-card`">"
    "<TableContainer component={Paper}>" = "<TableContainer component={Paper} className=`"clean-table`">"
    '<Button variant="contained">' = '<Button className="clean-button-primary">'
    '<Button variant="outlined">' = '<Button className="clean-button-secondary">'
    "<LinearProgress>" = '<LinearProgress className="clean-progress-bar">'
}

foreach ($old in $classReplacements.Keys) {
    Write-Host "   $old" -ForegroundColor Red
    Write-Host "   → $($classReplacements[$old])" -ForegroundColor Green
    Write-Host ""
}

Write-Host "3. STATUS CHIPS FOR CONSTRUCTION:" -ForegroundColor Yellow
Write-Host @"
   const getStatusChipClass = (status) => {
     switch (status) {
       case 'completed': return 'status-completed';    // ✅ Green
       case 'in-progress': return 'status-in-progress'; // 🟡 Orange  
       case 'planning': return 'status-review';         // 🔵 Blue
       case 'on-hold': return 'status-todo';            // ⚪ Gray
       default: return 'status-todo';
     }
   };

   <Chip
     label={project.status}
     className={`clean-chip ${getStatusChipClass(project.status)}`}
     size="small"
   />
"@ -ForegroundColor Gray

Write-Host ""
Write-Host "🏗️  Construction-Specific Examples:" -ForegroundColor Cyan

Write-Host ""
Write-Host "PROJECT CARD:" -ForegroundColor Yellow
Write-Host @"
   <Card className="clean-card">
     <CardContent sx={{ p: 3 }}>
       <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#0F1939' }}>
         {project.name}
       </Typography>
       <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
         {getClientName(project.clientId)}
       </Typography>
       
       <Chip
         label={project.status}
         className={`clean-chip status-${project.status}`}
         size="small"
       />
       
       <LinearProgress
         value={project.progress}
         className="clean-progress-bar"
       />
       
       <Typography sx={{ fontWeight: 600, color: '#0F1939' }}>
         {formatCurrency(project.budget)}
       </Typography>
     </CardContent>
   </Card>
"@ -ForegroundColor Gray

Write-Host ""
Write-Host "SECTION HEADERS:" -ForegroundColor Yellow
Write-Host @"
   <Box className="clean-section-header">
     <Box className="clean-section-indicator"></Box>
     <Typography className="clean-section-title">
       Active Projects
     </Typography>
   </Box>
"@ -ForegroundColor Gray

Write-Host ""
Write-Host "📁 Example Files Created:" -ForegroundColor Magenta
Write-Host "   📄 ProjectOverviewPage.jsx - Complete projects page with Notion UI" -ForegroundColor White
Write-Host "   📄 NotionTasksPage.jsx - Tasks management example" -ForegroundColor White  
Write-Host "   📄 NotionTeamPage.jsx - Team management example" -ForegroundColor White
Write-Host "   📄 Implementation Guide - Step-by-step instructions" -ForegroundColor White

Write-Host ""
Write-Host "🎨 Your Construction Color Palette:" -ForegroundColor Cyan
Write-Host "   🟡 Caramel Essence (#E3AF64) - Primary actions, progress" -ForegroundColor DarkYellow
Write-Host "   🔵 Sapphire Dust (#516AC8) - Secondary actions, info" -ForegroundColor Blue  
Write-Host "   ⚫ Cosmic Odyssey (#0F1939) - Headers, important text" -ForegroundColor DarkBlue
Write-Host "   🟢 Success (#10B981) - Completed status" -ForegroundColor Green
Write-Host "   🔴 Error (#EF4444) - Overdue, urgent items" -ForegroundColor Red

Write-Host ""
Write-Host "🚀 Start Converting:" -ForegroundColor Green
Write-Host "1. Pick one page (recommend starting with Projects)" -ForegroundColor White
Write-Host "2. Replace the page wrapper with CleanPageLayout" -ForegroundColor White
Write-Host "3. Add clean- classes to all components" -ForegroundColor White
Write-Host "4. Test the page thoroughly" -ForegroundColor White
Write-Host "5. Move to the next page" -ForegroundColor White

Write-Host ""
Write-Host "💡 Pro Tips for Construction PM:" -ForegroundColor Yellow
Write-Host "• Use progress bars for project completion" -ForegroundColor White
Write-Host "• Color-code by project status and priority" -ForegroundColor White
Write-Host "• Show budget and timeline prominently" -ForegroundColor White
Write-Host "• Make team assignments clearly visible" -ForegroundColor White
Write-Host "• Use clean tables for shop drawings and specs" -ForegroundColor White

Write-Host ""
Write-Host "✨ Result: Professional construction management UI" -ForegroundColor Green
Write-Host "   that your clients and team will love!" -ForegroundColor Green

Write-Host ""
Write-Host "Need help with specific components? Just ask!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan