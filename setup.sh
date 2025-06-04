#!/bin/bash

# 🚀 Bridge AI+BCI Platform - Quick Development Setup
# This script helps you get started with the Bridge platform quickly

set -e

echo "🧠 Bridge AI+BCI Platform - Development Setup"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        return 0
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        return 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
        return 0
    else
        print_error "npm is not installed. Please install npm."
        return 1
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Copy environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Environment file created from template"
    else
        print_warning "Environment file already exists"
    fi
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
    
    cd ..
}

# Main setup function
main() {
    print_status "Starting Bridge AI+BCI Platform setup..."
    
    # Check prerequisites
    if ! check_node || ! check_npm; then
        print_error "Prerequisites not met. Please install required software."
        exit 1
    fi
    
    # Setup frontend
    setup_frontend
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start the development server:"
    echo "   cd frontend && npm start"
    echo ""
    echo "2. Access the applications:"
    echo "   🎮 Interactive Demo: http://localhost:3000/demo.html"
    echo "   📱 React App: http://localhost:3000"
    echo "   📊 Dashboard: http://localhost:3000/dashboard"
    echo ""
    echo "3. Try the complete BCI training experience:"
    echo "   - Visit /demo.html for the full 4-step neural training journey"
    echo "   - Experience real-time BCI simulation and neural feedback"
    echo "   - Complete conflict resolution scenarios with AI partners"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md - Full project documentation"
    echo "   - QUICK_START.md - Quick start guide"
    echo "   - CONTRIBUTING.md - Contribution guidelines"
    echo ""
    echo "💼 Investment Information:"
    echo "   📧 investors@bridge-ai.com"
    echo "   💰 Series A: \$80M to dominate the \$1T neural communication market"
    echo ""
    echo "🧠 Happy Neural Training! 🚀"
}

# Run main function
main "$@"