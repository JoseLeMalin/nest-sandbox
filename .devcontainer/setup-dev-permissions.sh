#!/bin/bash
set -e

echo "Setting up development permissions for node user..."

# Ensure node user owns the workspace directory and all its contents
# This fixes issues with files created by the host (Windows) having different ownership
if [ -d "/app" ]; then
    echo "Fixing ownership of /app directory..."
    chown -R node:node /app 2>/dev/null || true
fi

# Ensure node user owns their home directory
if [ -d "/home/node" ]; then
    echo "Fixing ownership of /home/node directory..."
    chown -R node:node /home/node 2>/dev/null || true
fi

# Configure sudoers to allow node user to run specific commands without password
# This is safe for development containers and allows installing packages, etc.
if [ ! -f /etc/sudoers.d/node-dev ]; then
    echo "Configuring sudo permissions for node user..."
    cat > /etc/sudoers.d/node-dev << 'EOF'
# Allow node user to run common development commands without password
node ALL=(ALL) NOPASSWD: /usr/bin/apt-get
node ALL=(ALL) NOPASSWD: /usr/bin/apt
node ALL=(ALL) NOPASSWD: /bin/chown
node ALL=(ALL) NOPASSWD: /bin/chmod
node ALL=(ALL) NOPASSWD: /usr/bin/npm
node ALL=(ALL) NOPASSWD: /usr/local/bin/pnpm
node ALL=(ALL) NOPASSWD: /usr/bin/git
node ALL=(ALL) NOPASSWD: /bin/mkdir
node ALL=(ALL) NOPASSWD: /bin/rm
node ALL=(ALL) NOPASSWD: /bin/systemctl
EOF
    chmod 0440 /etc/sudoers.d/node-dev
    echo "Sudo permissions configured successfully."
fi

# Ensure git configuration is accessible
if [ -f /etc/gitconfig ]; then
    chmod 644 /etc/gitconfig 2>/dev/null || true
fi

# Create and set permissions for common cache directories
echo "Setting up cache directories..."
mkdir -p /home/node/.npm /home/node/.pnpm-store /home/node/.cache
chown -R node:node /home/node/.npm /home/node/.pnpm-store /home/node/.cache 2>/dev/null || true

# Ensure node_modules directory exists and is writable
if [ -d "/app/node_modules" ]; then
    echo "Fixing node_modules permissions..."
    chown -R node:node /app/node_modules 2>/dev/null || true
fi

# Fix permissions for pnpm global store if it exists
if [ -d "/pnpm" ]; then
    echo "Fixing pnpm store permissions..."
    chown -R node:node /pnpm 2>/dev/null || true
fi

# Ensure VS Code server directories are writable
mkdir -p /home/node/.vscode-server /home/node/.vscode-server-insiders
chown -R node:node /home/node/.vscode-server /home/node/.vscode-server-insiders 2>/dev/null || true

echo "✅ Development permissions setup completed!"
echo "The 'node' user can now:"
echo "  - Install packages with apt (sudo apt-get install <package>)"
echo "  - Manage npm/pnpm packages globally"
echo "  - Change file ownership and permissions"
echo "  - Access all workspace files"
