@echo off
echo ===========================================
echo   Formula PM - Server Stop Script
echo ===========================================
echo.

echo Checking for running Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe" >NUL
if "%ERRORLEVEL%"=="1" (
    echo No Node.js processes found running.
    echo.
    pause
    exit /b 0
)

echo Found running Node.js processes:
tasklist /FI "IMAGENAME eq node.exe"
echo.

echo Stopping processes on ports 5001 and 3002...

REM Kill processes using port 5001 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5001" ^| find "LISTENING"') do (
    echo Stopping backend process (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill processes using port 3002 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3002" ^| find "LISTENING"') do (
    echo Stopping frontend process (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill any remaining Node.js processes (safety measure)
echo Stopping any remaining Node.js processes...
taskkill /IM node.exe /F >nul 2>&1

echo.
echo Waiting 2 seconds for cleanup...
timeout /t 2 /nobreak >nul

echo.
echo ===========================================
echo   All Formula PM servers stopped!
echo ===========================================
echo.
echo You can now safely restart servers with: start-servers.bat
echo.
pause