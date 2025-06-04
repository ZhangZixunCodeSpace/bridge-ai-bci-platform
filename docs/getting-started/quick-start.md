# Quick Start Guide

Get Bridge AI+BCI Platform running in under 10 minutes.

## 🚀 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.9+** - [Download here](https://python.org/)
- **Docker & Docker Compose** - [Install here](https://docs.docker.com/get-docker/)
- **Git** - [Install here](https://git-scm.com/)

## 📥 Installation

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform.git
cd bridge-ai-bci-platform

# Copy environment configuration
cp .env.example .env

# Start all services with Docker
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
docker-compose logs -f
```

### Option 2: Manual Setup

```bash
# Clone and setup
git clone https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform.git
cd bridge-ai-bci-platform

# Install all dependencies
npm run install:all

# Setup environment
cp .env.example .env

# Start PostgreSQL and Redis (via Docker)
docker-compose up -d database redis

# Start all development servers
npm run dev
```

## 🌐 Access the Platform

Once everything is running, access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **BCI Simulator**: http://localhost:9000
- **API Docs**: http://localhost:5000/api-docs

## 🧠 Your First Training Session

### Step 1: Open the Platform
Navigate to http://localhost:3000 in your browser.

### Step 2: Start Neural Training
1. Click "🧠 Start Neural Training Journey"
2. The system will guide you through:
   - **Neural Calibration**: Establishes your brain baseline
   - **Scenario Selection**: Choose your training focus
   - **BCI Training**: Practice with real-time feedback
   - **Results Analysis**: Review your improvements

### Step 3: Experience the Features
- **Real-time Neural Feedback**: Watch your stress, empathy, and focus metrics
- **AI Conversation Partner**: Practice with realistic conflict scenarios
- **Neuroplasticity Analysis**: See how your brain changes during training
- **Personalized Recommendations**: Get AI-powered improvement suggestions

## 🔧 Configuration

### Essential Environment Variables

Edit your `.env` file:

```bash
# Database (required)
DATABASE_URL=postgresql://bridge_user:bridge_password@localhost:5432/bridge_db

# Redis (required)
REDIS_URL=redis://localhost:6379

# OpenAI API (optional, for real AI responses)
OPENAI_API_KEY=your-openai-api-key-here

# Security (change in production!)
JWT_SECRET=your-super-secret-jwt-key
```

### Feature Flags

```bash
# Enable/disable features
FEATURE_BCI_HARDWARE=false    # Set to true for real BCI devices
FEATURE_REAL_AI=true          # Use OpenAI or mock responses
FEATURE_ANALYTICS=true        # Enable user analytics
```

## 📊 Verify Installation

### Health Checks

```bash
# Check all services
curl http://localhost:3000          # Frontend
curl http://localhost:5000/health    # Backend
curl http://localhost:8000/health    # AI Service
curl http://localhost:9000/health    # BCI Simulator
```

### Database Check

```bash
# Connect to database
docker exec -it bridge-database psql -U bridge_user -d bridge_db

# List tables
\dt

# Exit
\q
```

### BCI Simulator Check

```bash
# Test BCI device connection
curl -X POST http://localhost:9000/api/connect \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "simulator-1", "userId": "test-user"}'
```

## 🎯 What's Next?

### For Developers
- 📖 Read the [Development Guide](../development/development-guide.md)
- 🔌 Explore the [API Documentation](../api/backend-api.md)
- 🧪 Check out [Testing Guide](../development/testing.md)

### For Researchers
- 🧠 Learn about [BCI Integration](../bci/overview.md)
- 🤖 Understand [AI Architecture](../ai/architecture.md)
- 📈 Review [Scientific Background](../research/scientific-background.md)

### For Business Users
- 💼 See [Business Model](../business/business-model.md)
- 📊 Check [Market Analysis](../business/market-analysis.md)
- 💰 Review [Investment Information](../business/investment.md)

## 🆘 Troubleshooting

### Common Issues

**Services won't start?**
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Restart services
docker-compose restart
```

**Database connection errors?**
```bash
# Reset database
docker-compose down -v
docker-compose up -d database
wait 30 seconds
docker-compose up -d
```

**Frontend not loading?**
```bash
# Clear browser cache
# Try incognito/private browsing
# Check browser console for errors
```

**BCI simulator not responding?**
```bash
# Check WebSocket connection
# Verify port 9001 is not blocked
# Restart BCI simulator service
docker-compose restart bci-simulator
```

### Getting Help

- 📧 **Email**: [support@bridge-ai.com](mailto:support@bridge-ai.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/bridge-ai)
- 📚 **Documentation**: [Full Docs](../README.md)

## 🎉 Success!

You now have a fully functional Bridge AI+BCI Platform running locally!

### Key Features You Can Explore:
- ✅ Real-time neural signal simulation
- ✅ AI-powered conversation generation
- ✅ Interactive training scenarios
- ✅ Neuroplasticity analysis
- ✅ Personalized feedback
- ✅ Progress tracking

### Next Steps:
1. **Try different training scenarios** (family, relationship, workplace)
2. **Experiment with AI personality styles** (emotional, direct, logical)
3. **Monitor your neural metrics** during training
4. **Review your progress** in the analysis section
5. **Explore the API documentation** for integration

Welcome to the future of communication training! 🚀🧠