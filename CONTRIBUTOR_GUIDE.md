# 🤝 Contributor Guide: Team Development Workflow

**A step-by-step guide to contributing to the Kompass-App project**

---

## 📋 Prerequisites

- Git installed and configured with SSH keys
- GitHub account with fork of the main repository
- Node.js and npm installed
- Code editor (VS Code recommended)

---

## 🔧 Initial Setup (One-time)

### 1. Fork & Clone Setup

```bash
# If you haven't forked yet, go to: https://github.com/Pahnini/kompass-app
# Click "Fork" button to create your copy

# Clone your fork (replace YOUR-USERNAME)
git clone git@github.com:YOUR-USERNAME/kompass-app.git
cd kompass-app

# Add the original repository as upstream
git remote add upstream git@github.com:Pahnini/kompass-app.git

# Verify remotes
git remote -v
# Should show:
# origin    git@github.com:YOUR-USERNAME/kompass-app.git (fetch)
# origin    git@github.com:YOUR-USERNAME/kompass-app.git (push)
# upstream  git@github.com:Pahnini/kompass-app.git (fetch)
# upstream  git@github.com:Pahnini/kompass-app.git (push)
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Setup

```bash
npm run dev
# App should run at http://localhost:5173
```

---

## 🔄 Daily Workflow

### Step 1: Start Fresh

Always start by getting the latest changes from the main project:

```bash
# Switch to main branch
git checkout main

# Get latest changes from upstream
git fetch upstream

# Merge upstream changes into your main
git merge upstream/main

# Push updated main to your fork
git push origin main
```

### Step 2: Create Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b fix/mood-compass-bug
# git checkout -b feature/new-badge-system
# git checkout -b enhancement/improve-ui
```

### Step 3: Make Your Changes

```bash
# Work on your code...
# Edit files, add features, fix bugs

# Check what files you've changed
git status

# See your changes
git diff
```

### Step 4: Test Your Changes

```bash
# Run the development server
npm run dev

# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Step 5: Commit Your Changes

```bash
# Add files to staging
git add .

# Or add specific files
git add src/components/NewComponent.tsx

# Commit with descriptive message
git commit -m "Add new badge system for user achievements"

# Examples of good commit messages:
# "Fix: Correct mood compass animation timing"
# "Feature: Add XP system with visual feedback"
# "Enhancement: Improve mobile responsiveness"
# "Docs: Update installation instructions"
```

### Step 6: Push and Create Pull Request

```bash
# Push your branch to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
# GitHub will usually show a banner with "Compare & pull request"
```

### Step 7: After PR is Merged

```bash
# Switch back to main
git checkout main

# Delete the feature branch (local)
git branch -d feature/your-feature-name

# Delete the feature branch (remote)
git push origin --delete feature/your-feature-name

# Get latest changes (including your merged PR)
git fetch upstream
git merge upstream/main
git push origin main
```

---

## 🎯 Project-Specific Guidelines

### Code Style

- Use TypeScript for all new components
- Follow the existing folder structure in `/src`
- Use the established naming conventions
- Add proper TypeScript types

### Testing Your Changes

```bash
# Before committing, always run:
npm run type-check  # Check for TypeScript errors
npm run lint        # Check for code style issues
npm run format      # Auto-format your code
npm run dev         # Test in browser
```

### Branch Naming Conventions

- `feature/description` - New features
- `fix/description` - Bug fixes
- `enhancement/description` - Improvements
- `docs/description` - Documentation changes

### Commit Message Format

```
Type: Brief description (50 chars max)

Optional longer description explaining what and why
```

Types: `Feature`, `Fix`, `Enhancement`, `Docs`, `Refactor`, `Test`

---

## 🔍 Finding Work

### 1. Check the Project Board

Visit: https://github.com/pahnini/kompass-app/projects/1

### 2. Look for Labels

- `good first issue` - Perfect for new contributors
- `help wanted` - Maintainer is looking for help
- `bug` - Something is broken
- `enhancement` - Improvement ideas

### 3. Follow the Roadmap

Check `docs/development-roadmap-guide.md` for planned features

---

## 🚨 Common Issues & Solutions

### Problem: "Your branch is behind"

```bash
git fetch upstream
git merge upstream/main
```

### Problem: Merge conflicts

```bash
# Edit conflicted files manually
# Remove conflict markers (<<<<<<, ======, >>>>>>)
git add .
git commit -m "Resolve merge conflicts"
```

### Problem: Accidentally committed to main

```bash
# Create a new branch from current state
git checkout -b feature/my-changes

# Reset main to upstream
git checkout main
git reset --hard upstream/main
```

### Problem: Need to update PR with new changes

```bash
# Make more changes
git add .
git commit -m "Address review feedback"
git push origin feature/your-feature-name
# PR will automatically update
```

---

## 🎉 Success Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] App runs without errors (`npm run dev`)
- [ ] Commit messages are descriptive
- [ ] PR description explains what and why
- [ ] Branch is up-to-date with upstream/main

---

## 📞 Getting Help

- **GitHub Issues**: Ask questions or report problems
- **Email**: florianpahn@aol.com
- **Documentation**: Check `docs/` folder for more guides

---

## 🎓 Learning Resources

- [Git Branching Guide](https://learngitbranching.js.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

**Remember**: Contributing to open source is about learning and helping others. Don't be afraid to ask questions or make mistakes – that's how we all learn! 🚀
