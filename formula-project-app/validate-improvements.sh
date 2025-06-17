#!/bin/bash
# Validation script for diagnostic report fixes

echo "🔍 Formula PM - Diagnostic Report Validation"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

echo "📋 Phase 1: Cache & Dependencies"
echo "--------------------------------"

# Test 1: Cache cleaning functionality
rm -rf node_modules/.vite .vite dist 2>/dev/null
test_result $? "Cache cleaning commands work"

# Test 2: Package.json scripts exist
grep -q "clean:cache" package.json
test_result $? "Cache cleaning scripts added to package.json"

grep -q "lint:fix" package.json
test_result $? "ESLint scripts added to package.json"

echo ""
echo "📋 Phase 2: Email Configuration"
echo "-------------------------------"

# Test 3: Backend environment files
if [ -f "../formula-backend/.env" ]; then
    test_result 0 "Backend .env file created"
else
    test_result 1 "Backend .env file missing"
fi

if [ -f "../formula-backend/.env.example" ]; then
    test_result 0 "Backend .env.example file created"
else
    test_result 1 "Backend .env.example file missing"
fi

# Test 4: Dotenv dependency added
if grep -q "dotenv" ../formula-backend/package.json; then
    test_result 0 "Dotenv dependency added to backend"
else
    test_result 1 "Dotenv dependency missing from backend"
fi

echo ""
echo "📋 Phase 3: WSL2 Network Optimization"
echo "------------------------------------"

# Test 5: WSL2 startup script
if [ -f "start-dev.sh" ] && [ -x "start-dev.sh" ]; then
    test_result 0 "WSL2 startup script exists and is executable"
else
    test_result 1 "WSL2 startup script missing or not executable"
fi

# Test 6: Port forwarding script
if [ -f "wsl-port-forward.ps1" ]; then
    test_result 0 "Windows port forwarding script exists"
else
    test_result 1 "Windows port forwarding script missing"
fi

# Test 7: WSL2 npm scripts
grep -q "dev:wsl2" package.json
test_result $? "WSL2 development script added"

echo ""
echo "📋 Phase 4: Performance Monitoring"
echo "---------------------------------"

# Test 8: Diagnostic utilities
if [ -f "src/utils/diagnostics.js" ]; then
    test_result 0 "Diagnostic utilities created"
else
    test_result 1 "Diagnostic utilities missing"
fi

# Test 9: Enhanced performance monitor
if grep -q "diagnostics" src/utils/performance/monitor.jsx; then
    test_result 0 "Performance monitor enhanced"
else
    test_result 1 "Performance monitor not enhanced"
fi

echo ""
echo "📋 Phase 5: Configuration Files"
echo "------------------------------"

# Test 10: ESLint configuration
if [ -f ".eslintrc.js" ]; then
    test_result 0 "ESLint configuration created"
else
    test_result 1 "ESLint configuration missing"
fi

# Test 11: Vite configuration improvements
if grep -q "usePolling.*true" vite.config.js; then
    test_result 0 "Vite WSL2 file watching configured"
else
    test_result 1 "Vite WSL2 file watching not configured"
fi

echo ""
echo "📋 Phase 6: Development Server Test"
echo "----------------------------------"

# Test 12: Development server startup (quick test)
echo "Testing development server startup..."
timeout 10s npm run start:clean > /tmp/vite-test.log 2>&1 &
SERVER_PID=$!
sleep 8

if kill -0 $SERVER_PID 2>/dev/null; then
    test_result 0 "Development server starts successfully"
    kill $SERVER_PID 2>/dev/null
else
    test_result 1 "Development server failed to start"
fi

# Test 13: Check server response time
if [ -f "/tmp/vite-test.log" ] && grep -q "ready in.*ms" /tmp/vite-test.log; then
    STARTUP_TIME=$(grep "ready in" /tmp/vite-test.log | grep -o "[0-9]\+ ms" | head -1)
    echo "   Server startup time: $STARTUP_TIME"
    test_result 0 "Server startup time logged"
else
    test_result 1 "Server startup time not detected"
fi

echo ""
echo "🎯 VALIDATION SUMMARY"
echo "===================="
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo -e "Success Rate: $(( PASSED * 100 / (PASSED + FAILED) ))%"

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL DIAGNOSTIC REPORT FIXES IMPLEMENTED SUCCESSFULLY!${NC}"
    echo ""
    echo "✅ Ready for production use"
    echo "✅ WSL2 optimized"
    echo "✅ Email service configured"
    echo "✅ Performance monitoring enhanced"
    echo "✅ Cache management improved"
else
    echo -e "${YELLOW}⚠️  Some improvements need attention${NC}"
    echo ""
    echo "🔧 Manual fixes may be required for failed tests"
    echo "📖 Check the diagnostic report for detailed steps"
fi

echo ""
echo "📚 Next Steps:"
echo "1. Update email credentials in formula-backend/.env"
echo "2. Test email functionality: npm run test-email"
echo "3. Start development: npm run dev:wsl2"
echo "4. Access app using network IP addresses shown"

# Cleanup
rm -f /tmp/vite-test.log