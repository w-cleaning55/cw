@echo off
title Cursor Network Fix Tool
color 0A

echo.
echo ========================================
echo    Cursor Network Fix Tool
echo ========================================
echo.
echo This tool will diagnose and attempt to fix
echo network connectivity issues with Cursor.
echo.
echo Press any key to start...
pause >nul

powershell -ExecutionPolicy Bypass -File "%~dp0fix_cursor_network.ps1" -AutoFix

echo.
echo Press any key to exit...
pause >nul
