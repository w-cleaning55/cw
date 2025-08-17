@echo off
title إصلاح مشكلة البروكسي لـ Cursor
color 0E

echo.
echo ========================================
echo    إصلاح مشكلة البروكسي لـ Cursor
echo ========================================
echo.
echo هذا البرنامج سيقوم بإصلاح مشكلة البروكسي
echo التي تسبب مشاكل الشبكة في Cursor.
echo.
echo اضغط أي مفتاح للبدء...
pause >nul

powershell -ExecutionPolicy Bypass -File "%~dp0fix_proxy_issue.ps1"

echo.
echo اضغط أي مفتاح للخروج...
pause >nul
