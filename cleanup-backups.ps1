# PowerShell script to remove backup files and folders
$basePath = "C:\Users\Kerem\Desktop\formula-pm\docs\ai-agent-system"

Write-Host "🗑️ Removing backup files and folders..." -ForegroundColor Yellow

$backupItems = @(
    "business-logic.backup",
    "workflows.backup", 
    "patterns.backup",
    "api.backup",
    "components.backup",
    "implementation_summary.backup"
)

foreach ($item in $backupItems) {
    $itemPath = Join-Path $basePath $item
    
    if (Test-Path $itemPath) {
        try {
            Remove-Item $itemPath -Recurse -Force
            Write-Host "✅ Removed: $item" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error removing $item`: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️ $item doesn't exist (already removed)" -ForegroundColor Gray
    }
}

Write-Host "`n🎉 Cleanup complete!" -ForegroundColor Green
Write-Host "📁 Final clean structure:" -ForegroundColor Cyan
Get-ChildItem $basePath | Format-Table Name, Length, LastWriteTime
