# Cursor Log Checker
Write-Host "📋 Checking Cursor Logs..." -ForegroundColor Cyan

# Find Cursor logs
$logPaths = @(
    "$env:APPDATA\Cursor\logs",
    "$env:APPDATA\Cursor\User\logs", 
    "$env:LOCALAPPDATA\Cursor\logs"
)

$foundLogs = $false
foreach ($path in $logPaths) {
    if (Test-Path $path) {
        Write-Host "📁 Found logs at: $path" -ForegroundColor Green
        $foundLogs = $true
        
        # Get recent log files
        $logFiles = Get-ChildItem -Path $path -Filter "*.log" -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 3
        
        foreach ($file in $logFiles) {
            Write-Host "`n📄 Analyzing: $($file.Name)" -ForegroundColor Yellow
            
            try {
                $content = Get-Content $file.FullName -Tail 50
                
                # Look for network errors
                $errors = $content | Where-Object { 
                    $_ -match "(error|Error|ERROR)" -and 
                    ($_ -match "(network|connection|timeout|dns|proxy|streaming)" -or
                     $_ -match "(api\.cursor\.sh|chat\.cursor\.sh|agent\.cursor\.sh)")
                }
                
                if ($errors.Count -gt 0) {
                    Write-Host "❌ Found $($errors.Count) network errors:" -ForegroundColor Red
                    foreach ($error in $errors | Select-Object -First 5) {
                        Write-Host "  $error" -ForegroundColor Gray
                    }
                } else {
                    Write-Host "✅ No network errors found" -ForegroundColor Green
                }
            } catch {
                Write-Host "❌ Error reading log file" -ForegroundColor Red
            }
        }
        break
    }
}

if (-not $foundLogs) {
    Write-Host "❌ No Cursor logs found" -ForegroundColor Red
}

# Check system events
Write-Host "`n🪟 Checking System Events..." -ForegroundColor Cyan
try {
    $events = Get-WinEvent -FilterHashtable @{
        LogName = 'System'
        StartTime = (Get-Date).AddHours(-6)
    } -ErrorAction SilentlyContinue | Where-Object {
        $_.Message -match "(network|dns|connection)" -and $_.Level -eq 2
    } | Select-Object -First 5
    
    if ($events.Count -gt 0) {
        Write-Host "⚠️ Found $($events.Count) network-related system errors:" -ForegroundColor Red
        foreach ($event in $events) {
            Write-Host "  [$($event.TimeCreated)] $($event.Message -replace "`n", " ")" -ForegroundColor Gray
        }
    } else {
        Write-Host "✅ No network system errors found" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error checking system events" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
