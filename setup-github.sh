#!/bin/bash
# Tasks Todo App - GitHub Setup for HACS Distribution
# Run this script to prepare your repo for HACS and custom addon repositories

set -e

echo "🚀 Tasks Todo App - GitHub Setup"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you set up your GitHub repo for HACS and custom addon distribution.${NC}"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Git repository not found. Initializing...${NC}"
    git init
fi

# Check for .gitignore
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
.devin/
*.DS_Store
node_modules/
.env
.env.local
.vscode/
.idea/
*.log
EOF
    git add .gitignore
fi

# Verify folder structure
echo ""
echo -e "${BLUE}Verifying folder structure...${NC}"

if [ ! -f "hacs.json" ]; then
    echo -e "${YELLOW}⚠️  hacs.json not found!${NC}"
else
    echo -e "${GREEN}✅ hacs.json found${NC}"
fi

if [ ! -d "addon-home-assistant" ]; then
    echo -e "${YELLOW}⚠️  addon-home-assistant folder not found!${NC}"
else
    echo -e "${GREEN}✅ addon-home-assistant folder found${NC}"
fi

if [ ! -d "tasks_todo_app" ]; then
    echo -e "${YELLOW}⚠️  tasks_todo_app integration folder not found!${NC}"
else
    echo -e "${GREEN}✅ tasks_todo_app integration folder found${NC}"
fi

# Check manifest.json in integration
if [ -f "tasks_todo_app/manifest.json" ]; then
    echo -e "${GREEN}✅ tasks_todo_app/manifest.json found${NC}"
else
    echo -e "${YELLOW}⚠️  tasks_todo_app/manifest.json not found!${NC}"
fi

# Check addon.yaml
if [ -f "addon-home-assistant/addon.yaml" ]; then
    echo -e "${GREEN}✅ addon-home-assistant/addon.yaml found${NC}"
else
    echo -e "${YELLOW}⚠️  addon-home-assistant/addon.yaml not found!${NC}"
fi

echo ""
echo -e "${BLUE}Stage all files for commit...${NC}"
git add -A

echo ""
echo -e "${BLUE}Current git status:${NC}"
git status

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Use repository name: 'tasks' (or your preferred name)"
echo "3. Make it PUBLIC (not private)"
echo "4. Copy the repository URL"
echo ""
echo "5. Add remote and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/tasks.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "6. Create a release (optional but recommended):"
echo "   git tag v1.0.0"
echo "   git push origin v1.0.0"
echo ""
echo "7. Add to Home Assistant:"
echo "   - Addon: Settings → Add-ons & Services → Add-ons → ⋯ → Repositories"
echo "   - Integration (HACS): HACS → Integrations → ⋯ → Custom repositories"
echo "   - Enter: https://github.com/YOUR_USERNAME/tasks"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo "- Full HACS Setup: INSTALL_HACS_METHOD.md"
echo "- All Installation Methods: INSTALLATION_GUIDE.md"
echo "- Quick Start: START_HERE_INSTALLATION.md"
