#!/bin/bash

echo "🔧 Configuring Environment Variables..."

# Prompt for Frontend Directory
read -p "Enter React App Directory Name (default: frontend): " frontend_dir
FRONTEND_DIR=${frontend_dir:-frontend}

# Prompt for Site Name
read -p "Enter Site Name (default: genmedainew.dev): " site_name
site_name=${site_name:-genmedainew.dev}

# Prompt for Socket Enable
read -p "Enable Socket in Local? (true/false, default: false): " enable_socket
enable_socket=${enable_socket:-false}

# Prompt for Socket Port
read -p "Enter Socket Port (default: 9000): " socket_port
socket_port=${socket_port:-9000}

echo "📝 Creating .env.local in $FRONTEND_DIR..."
cat > $FRONTEND_DIR/.env.local <<EOF
VITE_ENABLE_SOCKET=$enable_socket
VITE_SOCKET_PORT=$socket_port
VITE_SITE_NAME=$site_name
EOF

echo "📝 Creating .env.production in $FRONTEND_DIR..."
# As per previous request, socket is disabled in production
cat > $FRONTEND_DIR/.env.production <<EOF
VITE_ENABLE_SOCKET=false
EOF

echo "✅ Environment files created successfully!"
echo "   - Directory: $FRONTEND_DIR"
echo "   - .env.local: Socket=$enable_socket, Port=$socket_port, Site=$site_name"
echo "   - .env.production: Socket=false"
