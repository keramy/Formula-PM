@echo off
echo ===========================================
echo   Formula PM - Server Startup Script
echo ===========================================
echo.

echo Checking for existing Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo WARNING: Node.js processes are already running!
    echo Please run stop-servers.bat first to avoid conflicts.
    pause
    exit /b 1
)

echo Starting Formula PM Backend Server (Port 5001)...
echo.
start "Formula PM Backend" cmd /k "cd /d %~dp0formula-backend && echo Backend starting on http://localhost:5001 && npm start"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Formula PM Frontend Server (Port 3002)...
echo.
start "Formula PM Frontend" cmd /k "cd /d %~dp0formula-project-app && echo Frontend starting on http://localhost:3002 && npm start"

echo.
echo ===========================================
echo   Servers are starting up!
echo ===========================================
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3002
echo.
echo Both servers will open in separate windows.
echo Wait for "compiled successfully" message in frontend window.
echo.
echo To stop servers, run: stop-servers.bat
echo.
pause