# Cursor Network Diagnostics and Fix Script
# This script helps diagnose and fix network connectivity issues with Cursor AI services

param(
    [switch]$AutoFix,
    [switch]$Verbose
)

Write-Host "🔍 Cursor Network Diagnostics Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Function to test DNS resolution
function Test-DNSResolution {
    Write-Host "`n📡 Testing DNS Resolution..." -ForegroundColor Yellow
    
    $domains = @(
        "api.cursor.sh",
        "chat.cursor.sh", 
        "agent.cursor.sh",
        "marketplace.cursor.sh"
    )
    
    foreach ($domain in $domains) {
        try {
            $start = Get-Date
            $result = Resolve-DnsName -Name $domain -ErrorAction Stop
            $duration = (Get-Date) - $start
            $durationMs = [math]::Round($duration.TotalMilliseconds)
            
            if ($durationMs -gt 2000) {
                Write-Host "  ❌ $domain - Slow DNS lookup: ${durationMs}ms" -ForegroundColor Red
            } else {
                Write-Host "  ✅ $domain - ${durationMs}ms" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ❌ $domain - DNS resolution failed" -ForegroundColor Red
        }
    }
}

# Function to clear DNS cache
function Clear-DNSCache {
    Write-Host "`n🧹 Clearing DNS Cache..." -ForegroundColor Yellow
    try {
        ipconfig /flushdns | Out-Null
        Write-Host "  ✅ DNS cache cleared successfully" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to clear DNS cache" -ForegroundColor Red
    }
}

# Function to test HTTP connections
function Test-HTTPConnections {
    Write-Host "`n🌐 Testing HTTP Connections..." -ForegroundColor Yellow
    
    $urls = @(
        "https://api.cursor.sh/health",
        "https://chat.cursor.sh/health",
        "https://agent.cursor.sh/health"
    )
    
    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ $url - Connected" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $url - Status: $($response.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ❌ $url - Connection failed" -ForegroundColor Red
            if ($Verbose) {
                Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
            }
        }
    }
}

# Function to check proxy settings
function Test-ProxySettings {
    Write-Host "`n🔧 Checking Proxy Settings..." -ForegroundColor Yellow
    
    try {
        $proxy = [System.Net.WebRequest]::GetSystemWebProxy()
        $proxyUri = $proxy.GetProxy("https://api.cursor.sh")
        
        if ($proxyUri.ToString() -eq "https://api.cursor.sh") {
            Write-Host "  ✅ No proxy detected" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Proxy detected: $proxyUri" -ForegroundColor Yellow
            Write-Host "     This might be causing streaming issues" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ❌ Failed to check proxy settings" -ForegroundColor Red
    }
}

# Function to test WebSocket connections (for streaming)
function Test-WebSocketConnections {
    Write-Host "`n🔌 Testing WebSocket Connections..." -ForegroundColor Yellow
    
    # Note: This is a simplified test since PowerShell doesn't have native WebSocket support
    # We'll test if the ports are reachable
    $wsEndpoints = @(
        @{Host="chat.cursor.sh"; Port=443},
        @{Host="agent.cursor.sh"; Port=443}
    )
    
    foreach ($endpoint in $wsEndpoints) {
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $tcp.ConnectAsync($endpoint.Host, $endpoint.Port).Wait(5000) | Out-Null
            
            if ($tcp.Connected) {
                Write-Host "  ✅ $($endpoint.Host):$($endpoint.Port) - Reachable" -ForegroundColor Green
                $tcp.Close()
            } else {
                Write-Host "  ❌ $($endpoint.Host):$($endpoint.Port) - Not reachable" -ForegroundColor Red
            }
        } catch {
            Write-Host "  ❌ $($endpoint.Host):$($endpoint.Port) - Connection failed" -ForegroundColor Red
        }
    }
}

# Function to restart network services
function Restart-NetworkServices {
    Write-Host "`n🔄 Restarting Network Services..." -ForegroundColor Yellow
    
    try {
        # Restart DNS Client service
        Write-Host "  Restarting DNS Client service..." -ForegroundColor Gray
        Stop-Service -Name "Dnscache" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Start-Service -Name "Dnscache" -ErrorAction SilentlyContinue
        
        # Restart TCP/IP NetBIOS Helper
        Write-Host "  Restarting TCP/IP NetBIOS Helper..." -ForegroundColor Gray
        Stop-Service -Name "lmhosts" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Start-Service -Name "lmhosts" -ErrorAction SilentlyContinue
        
        Write-Host "  ✅ Network services restarted" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to restart network services" -ForegroundColor Red
    }
}

# Function to provide troubleshooting tips
function Show-TroubleshootingTips {
    Write-Host "`n💡 Troubleshooting Tips:" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host "1. If DNS is slow, try using different DNS servers:" -ForegroundColor White
    Write-Host "   - Google DNS: 8.8.8.8, 8.8.4.4" -ForegroundColor Gray
    Write-Host "   - Cloudflare DNS: 1.1.1.1, 1.0.0.1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. If streaming fails, check your firewall/proxy settings:" -ForegroundColor White
    Write-Host "   - Ensure Cursor.exe is allowed through firewall" -ForegroundColor Gray
    Write-Host "   - Disable proxy for Cursor if possible" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Try running Cursor as Administrator" -ForegroundColor White
    Write-Host ""
    Write-Host "4. If issues persist, try:" -ForegroundColor White
    Write-Host "   - Restarting your router" -ForegroundColor Gray
    Write-Host "   - Using a different network (mobile hotspot)" -ForegroundColor Gray
    Write-Host "   - Temporarily disabling antivirus/firewall" -ForegroundColor Gray
}

# Main execution
try {
    # Run diagnostics
    Test-DNSResolution
    Test-ProxySettings
    Test-HTTPConnections
    Test-WebSocketConnections
    
    if ($AutoFix) {
        Write-Host "`n🔧 Running Auto-Fix..." -ForegroundColor Yellow
        Clear-DNSCache
        Restart-NetworkServices
        
        Write-Host "`n⏳ Waiting 5 seconds for services to stabilize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        Write-Host "`n🔄 Re-running diagnostics after fixes..." -ForegroundColor Yellow
        Test-DNSResolution
        Test-HTTPConnections
    }
    
    Show-TroubleshootingTips
    
    Write-Host "`n✅ Diagnostics complete!" -ForegroundColor Green
    Write-Host "If issues persist, try restarting Cursor or your computer." -ForegroundColor Yellow
    
} catch {
    Write-Host "`n❌ An error occurred: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
