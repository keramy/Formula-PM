#!/bin/bash
# WSL2 React Development Performance Optimization Script
# Last Updated: June 17, 2025

echo "🚀 WSL2 React Development Performance Optimizer"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check WSL2 version and status
check_wsl_status() {
    echo -e "${BLUE}📊 Checking WSL2 Status...${NC}"
    echo "WSL Version:"
    wsl --version 2>/dev/null || echo "WSL version information not available"
    echo ""
    
    echo "Current WSL Status:"
    wsl --status 2>/dev/null || echo "WSL status not available"
    echo ""
    
    echo "Available Memory in WSL:"
    free -h
    echo ""
    
    echo "CPU Information:"
    nproc --all && echo "cores available"
    echo ""
}

# Function to check .wslconfig file
check_wslconfig() {
    echo -e "${BLUE}🔧 Checking .wslconfig Configuration...${NC}"
    
    WSLCONFIG_PATH="/mnt/c/Users/$USER/.wslconfig"
    if [ -f "$WSLCONFIG_PATH" ]; then
        echo -e "${GREEN}✅ .wslconfig file found${NC}"
        echo "Current configuration:"
        cat "$WSLCONFIG_PATH"
        echo ""
    else
        echo -e "${YELLOW}⚠️  .wslconfig file not found${NC}"
        echo "Consider creating one for optimal performance"
        echo ""
    fi
}

# Function to check React project environment
check_react_env() {
    echo -e "${BLUE}⚛️  Checking React Environment...${NC}"
    
    # Check if we're in a React project
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✅ React project detected${NC}"
        
        # Check React Scripts version
        REACT_SCRIPTS_VERSION=$(node -p "require('./package.json').dependencies['react-scripts']" 2>/dev/null)
        echo "React Scripts Version: $REACT_SCRIPTS_VERSION"
        
        # Check if .env file exists and has polling settings
        if [ -f ".env" ]; then
            echo -e "${GREEN}✅ .env file found${NC}"
            echo "Polling configuration:"
            grep -E "(CHOKIDAR_USEPOLLING|WATCHPACK_POLLING)" .env || echo "No polling configuration found"
        else
            echo -e "${YELLOW}⚠️  .env file not found${NC}"
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠️  Not in a React project directory${NC}"
        echo ""
    fi
}

# Function to test file watching performance
test_file_watching() {
    echo -e "${BLUE}🔍 Testing File Watching Performance...${NC}"
    
    # Create a test file
    TEST_FILE="wsl_performance_test.tmp"
    echo "test" > "$TEST_FILE"
    
    # Check if inotify works
    if command -v inotifywait >/dev/null 2>&1; then
        echo "Testing inotify file watching..."
        timeout 2s inotifywait -m "$TEST_FILE" 2>/dev/null &
        INOTIFY_PID=$!
        sleep 1
        echo "modified" >> "$TEST_FILE"
        sleep 1
        kill $INOTIFY_PID 2>/dev/null
        echo -e "${GREEN}✅ inotify test completed${NC}"
    else
        echo -e "${YELLOW}⚠️  inotify-tools not installed${NC}"
        echo "Install with: sudo apt install inotify-tools"
    fi
    
    # Clean up
    rm -f "$TEST_FILE"
    echo ""
}

# Function to check network performance
check_network_performance() {
    echo -e "${BLUE}🌐 Checking Network Performance...${NC}"
    
    # Test localhost connectivity
    if curl -s --connect-timeout 2 http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Localhost connectivity working${NC}"
    else
        echo -e "${YELLOW}⚠️  Localhost:3000 not accessible (React server may not be running)${NC}"
    fi
    
    # Check WSL IP
    WSL_IP=$(hostname -I | awk '{print $1}')
    echo "WSL IP Address: $WSL_IP"
    echo ""
}

# Function to provide optimization recommendations
provide_recommendations() {
    echo -e "${BLUE}💡 Performance Optimization Recommendations${NC}"
    echo "=========================================="
    
    echo "1. 📁 File System:"
    echo "   - Keep React projects in WSL filesystem (/home/user/) for best performance"
    echo "   - If using Windows filesystem, ensure polling is enabled"
    echo ""
    
    echo "2. 🔧 .wslconfig Optimization:"
    echo "   - Allocate 8GB+ memory for React development"
    echo "   - Use 4+ CPU cores for optimal performance"
    echo "   - Enable localhost forwarding"
    echo ""
    
    echo "3. ⚛️  React Development:"
    echo "   - Use WATCHPACK_POLLING=true for React Scripts 5.0+"
    echo "   - Consider disabling source maps for faster builds"
    echo "   - Use npm run start:fast for optimized development"
    echo ""
    
    echo "4. 🚀 Alternative Tools:"
    echo "   - Consider Vite for 50-100x faster development server"
    echo "   - Use Docker with WSL2 backend for containerized development"
    echo ""
    
    echo "5. 🔄 Maintenance:"
    echo "   - Restart WSL2 regularly: wsl --shutdown"
    echo "   - Monitor memory usage with: free -h"
    echo "   - Clear node_modules cache if performance degrades"
    echo ""
}

# Function to run performance optimizations
run_optimizations() {
    echo -e "${BLUE}⚡ Running Performance Optimizations...${NC}"
    
    # Increase file watch limits
    echo "Increasing file watch limits..."
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    echo -e "${GREEN}✅ File watch limits increased${NC}"
    
    # Clear npm cache
    if command -v npm >/dev/null 2>&1; then
        echo "Clearing npm cache..."
        npm cache clean --force
        echo -e "${GREEN}✅ npm cache cleared${NC}"
    fi
    
    # Clear yarn cache if yarn is installed
    if command -v yarn >/dev/null 2>&1; then
        echo "Clearing yarn cache..."
        yarn cache clean
        echo -e "${GREEN}✅ yarn cache cleared${NC}"
    fi
    
    echo ""
}

# Main execution
main() {
    check_wsl_status
    check_wslconfig
    check_react_env
    test_file_watching
    check_network_performance
    provide_recommendations
    
    echo -e "${YELLOW}Do you want to run performance optimizations? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        run_optimizations
    fi
    
    echo ""
    echo -e "${GREEN}🎉 WSL2 Performance Analysis Complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart WSL2: wsl --shutdown (from Windows)"
    echo "2. Restart your terminal"
    echo "3. Test React development server performance"
    echo "4. Monitor with: npm run wsl:status"
}

# Run the main function
main