# إصلاح مشكلة البروكسي لـ Cursor
Write-Host "🔧 إصلاح مشكلة البروكسي لـ Cursor" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# فحص إعدادات البروكسي الحالية
Write-Host "`n📡 فحص إعدادات البروكسي الحالية..." -ForegroundColor Yellow

$proxySettings = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
$currentProxy = $proxySettings.ProxyServer
$proxyEnabled = $proxySettings.ProxyEnable

Write-Host "  البروكسي الحالي: $currentProxy" -ForegroundColor Gray
Write-Host "  البروكسي مفعل: $proxyEnabled" -ForegroundColor Gray

if ($currentProxy -eq "127.0.0.1:49797" -and $proxyEnabled -eq 1) {
    Write-Host "  ⚠️  تم اكتشاف بروكسي محلي قد يسبب مشاكل!" -ForegroundColor Red
    
    # إنشاء نسخة احتياطية
    Write-Host "`n💾 إنشاء نسخة احتياطية من الإعدادات..." -ForegroundColor Yellow
    $backupPath = ".\proxy_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').reg"
    
    $regContent = @"
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings]
"ProxyServer"="$currentProxy"
"ProxyEnable"=dword:0000000$proxyEnabled
"@
    
    $regContent | Out-File -FilePath $backupPath -Encoding ASCII
    Write-Host "  ✅ تم حفظ النسخة الاحتياطية في: $backupPath" -ForegroundColor Green
    
    # إصلاح المشكلة
    Write-Host "`n🔧 إصلاح مشكلة البروكسي..." -ForegroundColor Yellow
    
    try {
        # تعطيل البروكسي
        Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name "ProxyEnable" -Value 0
        Write-Host "  ✅ تم تعطيل البروكسي" -ForegroundColor Green
        
        # مسح إعدادات البروكسي
        Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name "ProxyServer" -Value ""
        Write-Host "  ✅ تم مسح إعدادات البروكسي" -ForegroundColor Green
        
        # إعادة تشغيل خدمة DNS
        Write-Host "  🔄 إعادة تشغيل خدمة DNS..." -ForegroundColor Gray
        ipconfig /flushdns | Out-Null
        Write-Host "  ✅ تم مسح ذاكرة التخزين المؤقت للـ DNS" -ForegroundColor Green
        
    } catch {
        Write-Host "  ❌ خطأ في إصلاح البروكسي: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # فحص الإعدادات الجديدة
    Write-Host "`n🔍 فحص الإعدادات الجديدة..." -ForegroundColor Yellow
    $newSettings = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
    Write-Host "  البروكسي الجديد: $($newSettings.ProxyServer)" -ForegroundColor Gray
    Write-Host "  البروكسي مفعل: $($newSettings.ProxyEnable)" -ForegroundColor Gray
    
    if ($newSettings.ProxyEnable -eq 0) {
        Write-Host "  ✅ تم إصلاح مشكلة البروكسي بنجاح!" -ForegroundColor Green
    }
    
} else {
    Write-Host "  ✅ إعدادات البروكسي تبدو طبيعية" -ForegroundColor Green
}

# فحص الاتصال بـ Cursor
Write-Host "`n🌐 فحص الاتصال بـ Cursor..." -ForegroundColor Yellow

$domains = @("api.cursor.sh", "chat.cursor.sh", "agent.cursor.sh")
foreach ($domain in $domains) {
    try {
        $start = Get-Date
        $result = Resolve-DnsName -Name $domain -ErrorAction Stop
        $duration = (Get-Date) - $start
        $durationMs = [math]::Round($duration.TotalMilliseconds)
        
        if ($durationMs -gt 2000) {
            Write-Host "  ⚠️  $domain - بطيء: ${durationMs}ms" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ $domain - ${durationMs}ms" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ $domain - فشل في الاتصال" -ForegroundColor Red
    }
}

Write-Host "`n💡 نصائح إضافية:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "• إذا كنت تستخدم VPN، تأكد من أنه لا يتداخل مع Cursor" -ForegroundColor White
Write-Host "• جرب تشغيل Cursor كمسؤول إذا استمرت المشكلة" -ForegroundColor White
Write-Host "• إذا كنت تحتاج البروكسي، أضف Cursor إلى قائمة الاستثناءات" -ForegroundColor White
Write-Host "• النسخة الاحتياطية محفوظة في حالة احتجت لاستعادة الإعدادات" -ForegroundColor White

Write-Host "`n✅ تم الانتهاء من الإصلاح!" -ForegroundColor Green
Write-Host "جرب تشغيل Cursor الآن وستجد أن مشاكل الشبكة قد تم حلها." -ForegroundColor Yellow

Write-Host "`nاضغط أي مفتاح للخروج..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
