# Cursor Log Analysis Script
# This script analyzes Cursor logs and system logs to identify network issues

param(
    [switch]$Verbose,
    [switch]$ExportLogs
)

Write-Host "📋 Cursor Log Analysis Tool" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Function to get Cursor log directory
function Get-CursorLogPath {
    $possiblePaths = @(
        "$env:APPDATA\Cursor\logs",
        "$env:APPDATA\Cursor\User\logs", 
        "$env:LOCALAPPDATA\Cursor\logs",
        "$env:USERPROFILE\AppData\Roaming\Cursor\logs"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    return $null
}

# Function to analyze Cursor logs
function Analyze-CursorLogs {
    Write-Host "`n📁 Analyzing Cursor Logs..." -ForegroundColor Yellow
    
    $logPath = Get-CursorLogPath
    if (-not $logPath) {
        Write-Host "  ❌ Cursor logs directory not found" -ForegroundColor Red
        return
    }
    
    Write-Host "  📂 Log directory: $logPath" -ForegroundColor Gray
    
    # Get recent log files
    $logFiles = Get-ChildItem -Path $logPath -Filter "*.log" -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 5
    
    if ($logFiles.Count -eq 0) {
        Write-Host "  ❌ No log files found" -ForegroundColor Red
        return
    }
    
    Write-Host "  📄 Found $($logFiles.Count) recent log files" -ForegroundColor Gray
    
    foreach ($logFile in $logFiles) {
        Write-Host "`n  📋 Analyzing: $($logFile.Name)" -ForegroundColor Yellow
        
        try {
            $content = Get-Content $logFile.FullName -Tail 100 -ErrorAction Stop
            
            # Look for network-related errors
            $networkErrors = $content | Where-Object { 
                $_ -match "(error|Error|ERROR)" -and 
                ($_ -match "(network|Network|NETWORK)" -or 
                 $_ -match "(connection|Connection|CONNECTION)" -or
                 $_ -match "(timeout|Timeout|TIMEOUT)" -or
                 $_ -match "(dns|DNS)" -or
                 $_ -match "(proxy|Proxy|PROXY)" -or
                 $_ -match "(streaming|Streaming|STREAMING)" -or
                 $_ -match "(api\.cursor\.sh|chat\.cursor\.sh|agent\.cursor\.sh)")
            }
            
            if ($networkErrors.Count -gt 0) {
                Write-Host "    ⚠️  Found $($networkErrors.Count) network-related errors:" -ForegroundColor Red
                foreach ($error in $networkErrors | Select-Object -First 10) {
                    Write-Host "      $error" -ForegroundColor Gray
                }
            } else {
                Write-Host "    ✅ No network errors found in recent logs" -ForegroundColor Green
            }
            
            # Look for session start/end times
            $sessionInfo = $content | Where-Object { 
                $_ -match "(session|Session|SESSION)" -or 
                $_ -match "(started|Started|STARTED)" -or
                $_ -match "(stopped|Stopped|STOPPED)"
            }
            
            if ($sessionInfo.Count -gt 0) {
                Write-Host "    📅 Session information found:" -ForegroundColor Blue
                foreach ($info in $sessionInfo | Select-Object -First 5) {
                    Write-Host "      $info" -ForegroundColor Gray
                }
            }
            
        } catch {
            Write-Host "    ❌ Error reading log file: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Function to check Windows Event Logs
function Check-WindowsEventLogs {
    Write-Host "`n🪟 Checking Windows Event Logs..." -ForegroundColor Yellow
    
    try {
        # Check for network-related events in the last 24 hours
        $startTime = (Get-Date).AddHours(-24)
        
        $networkEvents = Get-WinEvent -FilterHashtable @{
            LogName = 'System'
            StartTime = $startTime
            ID = @(1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020)
        } -ErrorAction SilentlyContinue | Where-Object {
            $_.Message -match "(network|Network|NETWORK)" -or
            $_.Message -match "(connection|Connection|CONNECTION)" -or
            $_.Message -match "(dns|DNS)" -or
            $_.Message -match "(dhcp|DHCP)"
        }
        
        if ($networkEvents.Count -gt 0) {
            Write-Host "  ⚠️  Found $($networkEvents.Count) network-related system events:" -ForegroundColor Red
            foreach ($event in $networkEvents | Select-Object -First 5) {
                Write-Host "    [$($event.TimeCreated)] $($event.Message -replace "`n", " " -replace "`r", " ")" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ✅ No network-related system events found" -ForegroundColor Green
        }
        
        # Check for DNS resolution issues
        $dnsEvents = Get-WinEvent -FilterHashtable @{
            LogName = 'System'
            StartTime = $startTime
            ID = @(8015, 8016, 8017, 8018, 8019, 8020)
        } -ErrorAction SilentlyContinue
        
        if ($dnsEvents.Count -gt 0) {
            Write-Host "  ⚠️  Found $($dnsEvents.Count) DNS-related events:" -ForegroundColor Red
            foreach ($event in $dnsEvents | Select-Object -First 3) {
                Write-Host "    [$($event.TimeCreated)] $($event.Message -replace "`n", " " -replace "`r", " ")" -ForegroundColor Gray
            }
        }
        
    } catch {
        Write-Host "  ❌ Error checking Windows Event Logs: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to check network adapter status
function Check-NetworkAdapters {
    Write-Host "`n🌐 Checking Network Adapters..." -ForegroundColor Yellow
    
    try {
        $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
        
        foreach ($adapter in $adapters) {
            Write-Host "  📡 $($adapter.Name) - $($adapter.Status)" -ForegroundColor Green
            
            # Get IP configuration
            $ipConfig = Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -ErrorAction SilentlyContinue
            if ($ipConfig) {
                foreach ($ip in $ipConfig) {
                    if ($ip.AddressFamily -eq "IPv4") {
                        Write-Host "    IP: $($ip.IPAddress)" -ForegroundColor Gray
                    }
                }
            }
            
            # Get DNS servers
            $dnsServers = Get-DnsClientServerAddress -InterfaceIndex $adapter.ifIndex -ErrorAction SilentlyContinue
            if ($dnsServers) {
                Write-Host "    DNS: $($dnsServers.ServerAddresses -join ', ')" -ForegroundColor Gray
            }
        }
        
    } catch {
        Write-Host "  ❌ Error checking network adapters: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to check recent network connectivity
function Check-RecentNetworkIssues {
    Write-Host "`n🔍 Checking Recent Network Issues..." -ForegroundColor Yellow
    
    try {
        # Check if there were any recent network outages
        $pingResults = @()
        $testHosts = @("8.8.8.8", "1.1.1.1", "api.cursor.sh")
        
        foreach ($host in $testHosts) {
            try {
                $ping = Test-Connection -ComputerName $host -Count 1 -Quiet
                if ($ping) {
                    Write-Host "  ✅ $host - Reachable" -ForegroundColor Green
                } else {
                    Write-Host "  ❌ $host - Not reachable" -ForegroundColor Red
                }
            } catch {
                Write-Host "  ❌ $host - Connection failed" -ForegroundColor Red
            }
        }
        
        # Check current DNS resolution speed
        Write-Host "`n  📡 Current DNS Resolution Speed:" -ForegroundColor Yellow
        $domains = @("api.cursor.sh", "chat.cursor.sh", "agent.cursor.sh")
        
        foreach ($domain in $domains) {
            try {
                $start = Get-Date
                $result = Resolve-DnsName -Name $domain -ErrorAction Stop
                $duration = (Get-Date) - $start
                $durationMs = [math]::Round($duration.TotalMilliseconds)
                
                if ($durationMs -gt 2000) {
                    Write-Host "    ⚠️  $domain - Slow: ${durationMs}ms" -ForegroundColor Yellow
                } else {
                    Write-Host "    ✅ $domain - ${durationMs}ms" -ForegroundColor Green
                }
            } catch {
                Write-Host "    ❌ $domain - Failed" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-Host "  ❌ Error checking network connectivity: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to export logs if requested
function Export-Logs {
    if (-not $ExportLogs) { return }
    
    Write-Host "`n💾 Exporting Logs..." -ForegroundColor Yellow
    
    $exportPath = ".\cursor_logs_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $exportPath -Force | Out-Null
    
    # Export Cursor logs
    $logPath = Get-CursorLogPath
    if ($logPath) {
        Copy-Item -Path "$logPath\*" -Destination "$exportPath\cursor_logs\" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Cursor logs exported to: $exportPath\cursor_logs\" -ForegroundColor Green
    }
    
    # Export system events
    try {
        $startTime = (Get-Date).AddHours(-24)
        $events = Get-WinEvent -FilterHashtable @{
            LogName = 'System'
            StartTime = $startTime
        } -ErrorAction SilentlyContinue | Where-Object {
            $_.Message -match "(network|Network|NETWORK|dns|DNS|connection|Connection)"
        }
        
        if ($events) {
            $events | Export-Csv -Path "$exportPath\system_events.csv" -NoTypeInformation
            Write-Host "  ✅ System events exported to: $exportPath\system_events.csv" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Failed to export system events" -ForegroundColor Red
    }
    
    Write-Host "  📁 All logs exported to: $exportPath" -ForegroundColor Cyan
}

# Main execution
try {
    Write-Host "🔍 Starting comprehensive log analysis..." -ForegroundColor Cyan
    
    Analyze-CursorLogs
    Check-WindowsEventLogs
    Check-NetworkAdapters
    Check-RecentNetworkIssues
    Export-Logs
    
    Write-Host "`n📊 Analysis Summary:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "• Checked Cursor application logs for network errors" -ForegroundColor White
    Write-Host "• Analyzed Windows system events for network issues" -ForegroundColor White
    Write-Host "• Verified current network adapter status" -ForegroundColor White
    Write-Host "• Tested current network connectivity" -ForegroundColor White
    
    if ($ExportLogs) {
        Write-Host "• Exported logs for further analysis" -ForegroundColor White
    }
    
    Write-Host "`n💡 Recommendations:" -ForegroundColor Yellow
    Write-Host "• If DNS issues found, try changing DNS servers" -ForegroundColor White
    Write-Host "• If proxy detected, consider disabling it for Cursor" -ForegroundColor White
    Write-Host "• Check firewall settings for Cursor.exe" -ForegroundColor White
    Write-Host "• Monitor system resources during Cursor usage" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ An error occurred during analysis: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
