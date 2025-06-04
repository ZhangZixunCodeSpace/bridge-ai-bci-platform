# Quick Start Guide

Get Bridge AI+BCI Platform running in minutes!

## 🚀 1-Minute Setup

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- 8GB+ RAM available

### Installation

```bash
# Clone the repository
git clone https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform.git
cd bridge-ai-bci-platform

# Start all services with Docker
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
docker-compose logs -f
```

### Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **BCI Simulator**: http://localhost:9000
- **API Documentation**: http://localhost:5000/api-docs

## 🎯 Your First Training Session

1. **Open Browser**: Navigate to http://localhost:3000
2. **Welcome Screen**: Click "Start Neural Training Journey"
3. **Neural Calibration**: Click "Begin Neural Calibration" and wait 30 seconds
4. **Choose Scenario**: Select "Romantic Relationship" scenario
5. **BCI Training**: Practice the conversation with real-time neural feedback
6. **View Results**: See your neuroplasticity improvements!

## 🔧 Manual Setup (Alternative)

If you prefer to run services individually:

```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start all services in development mode
npm run dev
```

## 🧪 Testing the Setup

### Health Checks
```bash
# Check all services are running
curl http://localhost:3000  # Frontend
curl http://localhost:5000/health  # Backend
curl http://localhost:8000/health  # AI Service
curl http://localhost:9000/health  # BCI Simulator
```

### API Test
```bash
# Test BCI simulator
curl -X POST http://localhost:9000/api/connect \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "simulator-1", "userId": "test-user"}'
```

## 🔍 Verification

✅ **All services running**: Check Docker containers or terminal outputs  
✅ **Frontend accessible**: Can load homepage  
✅ **BCI simulation working**: Neural metrics updating in real-time  
✅ **AI responses**: Can start a training conversation  
✅ **WebSocket connection**: Real-time updates working  

## 🆘 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :8000  # AI Service
lsof -i :9000  # BCI Simulator
```

**Docker issues**:
```bash
# Reset Docker environment
docker-compose down
docker system prune -f
docker-compose up -d
```

**Memory issues**:
```bash
# Check available memory
free -h
# Increase Docker memory allocation to 8GB+
```

**Database connection issues**:
```bash
# Check database logs
docker-compose logs database
# Restart database
docker-compose restart database
```

### Getting Help

- 📧 **General Help**: [hello@bridge-ai.com](mailto:hello@bridge-ai.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/bridge-ai)
- 📚 **Documentation**: [Full Docs](../README.md)

## 🎉 What's Next?

- **Explore Features**: Try different training scenarios
- **Read Documentation**: Understanding the technology
- **Contribute**: Join our development community
- **Deploy**: Set up your own production instance
- **Research**: Dive into the neuroscience

---

**Welcome to Bridge - where AI meets neuroscience to revolutionize human communication!** 🧠✨