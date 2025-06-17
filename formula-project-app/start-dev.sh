#!/bin/bash
# WSL2 Development Server Starter with Network Diagnostics

echo "🚀 Starting Formula Project Management App..."
echo "📍 Working directory: $(pwd)"

# Check if backend is running
echo ""
echo "🔍 Checking backend status..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5001"
else
    echo "⚠️  Backend not detected. Start it with: cd ../formula-backend && npm start"
fi

# Get WSL2 IP addresses
WSL_HOST_IP=$(hostname -I | awk '{print $1}')
NETWORK_IP=$(hostname -I | awk '{print $2}')
WSL2_GATEWAY=$(ip route | grep default | awk '{print $3}' | head -1)

echo ""
echo "🌐 Network Configuration:"
echo "   • WSL2 IP:     ${WSL_HOST_IP}"
echo "   • Network IP:  ${NETWORK_IP:-"Not available"}"
echo "   • WSL2 Gateway: ${WSL2_GATEWAY}"

echo ""
echo "🌐 Available URLs after server starts:"
echo "   • Primary:     http://${WSL_HOST_IP}:3000/"
if [ ! -z "$NETWORK_IP" ]; then
echo "   • Alternative: http://${NETWORK_IP}:3000/"
fi
echo "   • Gateway:     http://${WSL2_GATEWAY}:3000/"

echo ""
echo "💡 Troubleshooting localhost issues:"
echo "   1. Use one of the network URLs above"
echo "   2. Run 'npm run wsl:port-forward' for Windows port forwarding"
echo "   3. Check Windows Firewall settings"

echo ""
echo "🧹 Cleaning cache and starting server..."
echo "----------------------------------------"

# Clean cache and start with optimized config
npm run clean:cache
npm run start:fast