# Contributing to QA Influencers Ranking

First off, thank you for considering contributing to QA Influencers Ranking! It's people like you that make this a great tool for the QA community.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Adding a QA Professional](#adding-a-qa-professional)
4. [Development Setup](#development-setup)
5. [Pull Request Process](#pull-request-process)
6. [Style Guidelines](#style-guidelines)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Possible implementation** if you have ideas
- **Mockups or examples** if applicable

### Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## Adding a QA Professional

To add a QA professional to the ranking:

### Criteria for Inclusion

A professional should meet these criteria:

- ✅ Active in QA field (current role or recent experience)
- ✅ Public LinkedIn profile
- ✅ Minimum 5,000 followers on LinkedIn
- ✅ Contributes to QA community (blogs, talks, open source, courses, books, etc.)
- ✅ Profile information is publicly available

### Steps to Add

1. **Fork the repository**

2. **Edit** `data/qa-professionals.json`

3. **Add the professional** to the latest snapshot:

```json
{
  "id": "unique-id-here",
  "name": "Full Name",
  "profilePicture": "https://url-to-profile-picture.jpg",
  "linkedinUrl": "https://www.linkedin.com/in/username/",
  "followers": 15000,
  "location": {
    "country": "Country Name",
    "countryCode": "US",
    "state": "State Name",
    "stateCode": "CA"
  },
  "title": "Current Job Title",
  "company": "Company Name",
  "lastUpdated": "2025-11-04T00:00:00Z"
}
```

4. **Important:**
   - Use a unique ID (increment from last ID or use UUID)
   - Verify follower count is accurate (within ±100)
   - Use ISO date format for `lastUpdated`
   - Include country code (ISO 3166-1 alpha-2)
   - State is optional but recommended

5. **Commit** with descriptive message:
   ```bash
   git commit -m "Add [Name] to global ranking"
   ```

6. **Submit** a pull request

### Profile Picture Guidelines

- Use the official LinkedIn profile picture URL
- If unavailable, use a placeholder or leave as URL
- Ensure image is appropriate and professional
- System will auto-generate fallback if image fails to load

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/qa-influencers-ranking.git
cd qa-influencers-ranking

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Running Tests (Future)

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests (when available)
npm test
```

---

## Pull Request Process

1. **Create a branch** with a descriptive name:
   ```bash
   git checkout -b feature/add-professional-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**
   - Keep commits focused and atomic
   - Write clear commit messages
   - Follow code style guidelines

3. **Test your changes**
   - Build succeeds: `npm run build`
   - No TypeScript errors: `npm run type-check`
   - Test locally: `npm run dev`

4. **Update documentation** if needed
   - Update README.md if adding features
   - Update CHANGELOG.md with your changes

5. **Submit pull request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Include screenshots for UI changes

6. **Respond to feedback**
   - Address review comments promptly
   - Make requested changes
   - Re-request review when ready

### PR Title Format

Use conventional commit format:

- `feat: Add country filtering`
- `fix: Correct follower count display`
- `docs: Update deployment guide`
- `style: Improve card spacing`
- `refactor: Simplify ranking calculation`
- `chore: Update dependencies`

---

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces for data structures
- Avoid `any` type
- Use descriptive variable names

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

### File Structure

```typescript
// Import order:
// 1. React/Next.js
// 2. External libraries
// 3. Internal components
// 4. Types
// 5. Utilities
// 6. Styles

import { useState } from 'react'
import Image from 'next/image'
import { RankedQAProfessional } from '@/types'
import { formatFollowerCount } from '@/lib/ranking'
import styles from './Component.module.css'
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use semantic class names
- Ensure responsive design

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(ranking): Add country filter functionality

- Added country selector component
- Implemented filtering logic
- Updated UI to show filtered results

Closes #123
```

---

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Reach out to maintainers
- Check existing documentation

---

**Thank you for contributing! 🎉**
