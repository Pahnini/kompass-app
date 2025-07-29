# 🛠️ Contributor Tools Quick Start

This directory now includes tools to help you contribute effectively to the Kompass-App project!

## 📖 Documentation

- **`CONTRIBUTOR_GUIDE.md`** - Complete step-by-step guide for team development
- **`contributor-helper.sh`** - Interactive script to automate common tasks

## 🚀 Quick Start

### Option 1: Use the Interactive Script

```bash
# Run the contributor helper
npm run contributor
# or
./contributor-helper.sh
```

### Option 2: Manual Commands

**Set up remotes (first time only):**

```bash
git remote add origin git@github.com:YOUR-USERNAME/kompass-app.git
git remote add upstream git@github.com:Pahnini/kompass-app.git
```

**Daily workflow:**

```bash
# 1. Start fresh
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and test
npm run prepare  # Runs format, lint, and type-check

# 4. Commit
git add .
git commit -m "Your descriptive message"

# 5. Push and create PR
git push origin feature/your-feature-name
```

## 🎯 Available npm Scripts

- `npm run dev` - Start development server
- `npm run contributor` - Run interactive helper script
- `npm run prepare` - Run all quality checks (format + lint + type-check)
- `npm run type-check` - Check TypeScript errors
- `npm run lint` - Check code style
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier

## 📋 Workflow Checklist

Before each commit:

- [ ] Code is working (`npm run dev`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] No linting issues (`npm run lint`)
- [ ] Descriptive commit message

Before each PR:

- [ ] Branch is up-to-date with upstream/main
- [ ] All tests pass
- [ ] PR has clear description
- [ ] Related issue is referenced (if applicable)

## 🎓 Learning Path

1. **Read** `CONTRIBUTOR_GUIDE.md` for detailed explanations
2. **Try** the interactive script to learn the workflow
3. **Practice** with small changes first
4. **Ask** questions in GitHub issues if stuck!

---

Happy contributing! 🧭✨
