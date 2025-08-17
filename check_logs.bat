@echo off
title Cursor Log Checker
color 0B

echo.
echo ========================================
echo    Cursor Log Checker
echo ========================================
echo.
echo This tool will check Cursor logs and system
echo events to identify network issues.
echo.
echo Press any key to start...
pause >nul

powershell -ExecutionPolicy Bypass -File "%~dp0check_logs.ps1"

echo.
echo Press any key to exit...
pause >nul
