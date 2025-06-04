# Contributing to Bridge AI+BCI Platform

Thank you for your interest in contributing to Bridge! This document provides guidelines and information for contributors.

## 🎯 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Recognition](#recognition)

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to creating a positive environment include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior include:**

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at [conduct@bridge-ai.com](mailto:conduct@bridge-ai.com).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- Git
- Basic understanding of TypeScript, React, Express, FastAPI
- Familiarity with neuroscience/BCI concepts (helpful but not required)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/bridge-ai-bci-platform.git
   cd bridge-ai-bci-platform
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ZhangZixunCodeSpace/bridge-ai-bci-platform.git
   ```

3. **Set up the development environment**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Install dependencies
   npm run install:all
   
   # Start development servers
   npm run dev
   ```

4. **Verify setup**
   ```bash
   # All services should be running
   curl http://localhost:3000  # Frontend
   curl http://localhost:5000/health  # Backend
   curl http://localhost:8000/health  # AI Service
   curl http://localhost:9000/health  # BCI Simulator
   ```

## 💻 Development Process

### Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test          # Run all tests
   npm run lint          # Check code style
   npm run type-check    # TypeScript checks
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add neural pathway optimization algorithm"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Then create a Pull Request on GitHub
   ```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(bci): add EEG signal filtering algorithm
fix(api): resolve authentication token expiration issue
docs(readme): update installation instructions
test(neural): add unit tests for emotion detection
```

## 🎨 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional programming patterns
- Use async/await over promises
- Add JSDoc comments for functions

```typescript
/**
 * Analyzes neural signals for emotion detection
 * @param signalData - Raw EEG signal data
 * @param sampleRate - Signal sampling rate in Hz
 * @returns Promise resolving to emotion classification
 */
async function analyzeEmotions(
  signalData: number[][],
  sampleRate: number
): Promise<EmotionClassification> {
  // Implementation
}
```

### Python

- Use Python 3.9+ features
- Follow PEP 8 style guide
- Use Black for formatting
- Use type hints
- Add docstrings for functions/classes

```python
def process_neural_data(
    eeg_data: np.ndarray, 
    sampling_rate: int = 256
) -> Dict[str, float]:
    """
    Process EEG data and extract neural metrics.
    
    Args:
        eeg_data: Raw EEG signal data (channels x samples)
        sampling_rate: Sampling rate in Hz
        
    Returns:
        Dictionary containing extracted neural metrics
    """
    # Implementation
```

### React Components

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Use Tailwind CSS for styling
- Follow accessibility guidelines
- Implement error boundaries

```tsx
interface BCIMetricsProps {
  metrics: NeuralMetrics;
  isRealtime: boolean;
  onMetricUpdate: (metric: string, value: number) => void;
}

const BCIMetrics: React.FC<BCIMetricsProps> = ({ 
  metrics, 
  isRealtime, 
  onMetricUpdate 
}) => {
  // Implementation
};
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── services/            # API and business logic
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

## 🧪 Testing Guidelines

### Testing Strategy

- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test API endpoints and services
- **E2E Tests**: Test complete user workflows
- **BCI Tests**: Test neural signal processing

### Frontend Testing

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { BCICalibration } from '../BCICalibration';

test('should start calibration when button is clicked', async () => {
  const onCalibrationStart = jest.fn();
  
  render(<BCICalibration onStart={onCalibrationStart} />);
  
  const startButton = screen.getByRole('button', { name: /start calibration/i });
  fireEvent.click(startButton);
  
  expect(onCalibrationStart).toHaveBeenCalled();
});
```

### Backend Testing

```typescript
// API endpoint testing with supertest
import request from 'supertest';
import { app } from '../app';

describe('/api/bci/connect', () => {
  test('should connect to BCI device', async () => {
    const response = await request(app)
      .post('/api/bci/connect')
      .send({ deviceType: 'simulator', userId: 'test-user' })
      .expect(200);
      
    expect(response.body).toHaveProperty('sessionId');
  });
});
```

### Python Testing

```python
# Neural processing testing with pytest
import pytest
import numpy as np
from neural_processor import EmotionDetector

def test_emotion_detection():
    detector = EmotionDetector()
    
    # Generate test EEG data
    eeg_data = np.random.randn(32, 1000)  # 32 channels, 1000 samples
    
    emotions = detector.detect_emotions(eeg_data)
    
    assert 'valence' in emotions
    assert 'arousal' in emotions
    assert -1 <= emotions['valence'] <= 1
```

### Running Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# AI service tests
cd ai-service && python -m pytest

# BCI simulator tests
cd bci-simulator && npm test

# All tests
npm run test

# Coverage reports
npm run test:coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc/docstring comments to all public functions
- Include usage examples in complex functions
- Document API endpoints with OpenAPI/Swagger
- Update README files when adding new features

### API Documentation

```typescript
/**
 * @swagger
 * /api/bci/connect:
 *   post:
 *     summary: Connect to BCI device
 *     tags: [BCI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceType:
 *                 type: string
 *                 enum: [simulator, neurable, openbci]
 */
router.post('/connect', connectToBCI);
```

### User Documentation

- Update user guides for new features
- Include screenshots for UI changes
- Write clear, step-by-step instructions
- Test documentation with new users

## 📝 Submitting Changes

### Pull Request Guidelines

1. **PR Title**: Use conventional commit format
2. **Description**: Clearly explain what and why
3. **Screenshots**: Include for UI changes
4. **Testing**: Document how you tested
5. **Breaking Changes**: Clearly mark and explain

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Criteria

Your PR will be reviewed for:

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it clean, readable, maintainable?
- **Performance**: Does it impact system performance?
- **Security**: Are there any security implications?
- **Testing**: Is it adequately tested?
- **Documentation**: Is it properly documented?

## 🔍 Review Process

### Review Timeline

- **Small fixes**: 1-2 days
- **New features**: 3-5 days
- **Large changes**: 1-2 weeks

### Review Process

1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: Team member reviews code
3. **Testing**: Manual testing if needed
4. **Approval**: Required approvals obtained
5. **Merge**: Changes merged to main branch

### Review Responsibilities

**As a Contributor:**
- Respond to feedback promptly
- Make requested changes
- Keep PR up to date with main branch
- Be open to suggestions

**As a Reviewer:**
- Provide constructive feedback
- Explain reasoning for changes
- Be respectful and helpful
- Approve when standards are met

## 🏆 Recognition

### Contributors

All contributors are recognized in:
- GitHub contributors list
- Project documentation
- Release notes
- Annual contributor awards

### Contribution Types

We value all types of contributions:
- 💻 Code contributions
- 📖 Documentation improvements
- 🐛 Bug reports
- 💡 Feature suggestions
- 🎨 Design contributions
- 🧪 Testing and QA
- 🌍 Translation
- 💬 Community support

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: [Join our server](https://discord.gg/bridge-ai)
- **Email**: [dev@bridge-ai.com](mailto:dev@bridge-ai.com)

### Mentorship

New contributors can request mentorship:
- Code review guidance
- Architecture discussions
- Best practices learning
- Career development advice

### Office Hours

Join our weekly virtual office hours:
- **When**: Fridays 2-3 PM UTC
- **Where**: Discord voice channel
- **What**: Q&A, pair programming, architecture discussions

---

## 🙏 Thank You

Thank you for contributing to Bridge! Your efforts help advance the future of human communication through AI and neuroscience. Together, we're building technology that makes meaningful connections possible.

**Questions?** Feel free to reach out at [dev@bridge-ai.com](mailto:dev@bridge-ai.com)

---

*This document is living and will be updated as the project evolves. Last updated: June 2025*