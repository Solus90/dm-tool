# Contributing to D&D DM Tool

Thank you for your interest in contributing! This project is built by the D&D community, for the D&D community. We welcome contributions from developers of all skill levels.

## 🎯 Ways to Contribute

### 1. **Report Bugs** 🐛
Found a bug? Please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots (if applicable)

### 2. **Suggest Features** 💡
Have an idea? Open an issue with:
- What problem does it solve?
- How should it work?
- Any examples from other tools?
- Would you be willing to implement it?

### 3. **Write Code** 💻
Ready to code? Here's how:

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/dm-tool.git
   cd dm-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

5. **Make your changes**
   - Write clean, commented code
   - Follow existing patterns
   - Test thoroughly in the browser

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe what you changed and why
   - Link any related issues

### 4. **Improve Documentation** 📚
Help others by:
- Improving README
- Adding code comments
- Creating tutorials
- Fixing typos

### 5. **Test & Review** 🔍
- Test pull requests
- Review code
- Report issues
- Provide feedback

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use strict mode, add types for everything
- **Components**: Functional components with hooks (no class components)
- **File naming**: kebab-case for files (`monster-list.tsx`)
- **Component naming**: PascalCase for components (`MonsterList`)
- **Formatting**: Let Prettier handle it (will be auto-formatted)

### Project Structure

```
app/                    # Pages (Next.js App Router)
components/             # React components
  ├── ui/              # shadcn/ui base components
  ├── layout/          # Layout components (sidebar, etc.)
  └── [feature]/       # Feature-specific components
lib/                    # Business logic
  ├── db/              # Database layer (most important!)
  ├── stores/          # State management (Zustand)
  ├── api/             # External API integrations
  └── hooks/           # Custom React hooks
```

### Database Changes

If you need to change the database schema:

1. **Update types** in `lib/db/types.ts`
2. **Update schema** in `lib/db/database.ts`
   - Increment version number: `this.version(2).stores({...})`
   - Add migration logic if needed
3. **Update hooks** in `lib/db/hooks.ts`
4. **Update export format** in `lib/db/export.ts` if needed
5. **Test thoroughly** - database changes can break existing data!

### Adding New Components

1. Place in appropriate directory (`components/[feature]/`)
2. Import shadcn/ui components from `@/components/ui/`
3. Use existing patterns (see similar components)
4. Add TypeScript types for props
5. Use hooks from `lib/db/hooks.ts` for data access

### Testing Checklist

Before submitting a PR, please test:

- ✅ **Core functionality works** (combat, monsters, etc.)
- ✅ **Multiple campaigns** (switch between campaigns)
- ✅ **Export/Import** (backup and restore works)
- ✅ **Data persistence** (reload page, data still there)
- ✅ **Different browsers** (Chrome, Firefox, Safari if possible)
- ✅ **Responsive design** (desktop and tablet views)
- ✅ **Dark mode** (toggle still works)

## 🎨 UI/UX Guidelines

### Design Principles

1. **Function over form** - DMs need tools that work, not flashy animations
2. **Keyboard shortcuts** - DMs have their hands full with books and dice
3. **Quick access** - Common actions should be 1-2 clicks max
4. **No surprises** - Save automatically, confirm destructive actions
5. **Mobile-friendly** - But optimize for desktop/tablet

### Component Guidelines

- Use shadcn/ui components (consistent look & feel)
- Follow existing color scheme (Tailwind classes)
- Add loading states (data may take time to load)
- Handle empty states (what if there are no monsters yet?)
- Add error handling (what if API call fails?)

## 🐛 Common Pitfalls

### Database Issues

❌ **Don't do this:**
```typescript
// Chaining orderBy after where().equals() doesn't work in Dexie
db.monsters.where("campaign_id").equals(1).orderBy("name")
```

✅ **Do this instead:**
```typescript
// Fetch first, then sort with JavaScript
const monsters = await db.monsters.where("campaign_id").equals(1).toArray();
monsters.sort((a, b) => a.name.localeCompare(b.name));
```

### State Management

❌ **Don't do this:**
```typescript
// Don't put database data in Zustand
const [monsters, setMonsters] = useMonsterStore();
```

✅ **Do this instead:**
```typescript
// Use Dexie hooks for database data (auto-updates!)
const monsters = useMonsters(campaignId);
```

### TypeScript Errors

❌ **Don't do this:**
```typescript
// @ts-ignore
const monster: any = ...;
```

✅ **Do this instead:**
```typescript
// Use proper types from lib/db/types.ts
import type { Monster } from "@/lib/db/types";
const monster: Monster = ...;
```

## 🚀 Feature Ideas for Contributors

Looking for something to work on? Here are some ideas:

### Easy (Good First Issues)
- [ ] Add more D&D 5e conditions to reference
- [ ] Improve error messages
- [ ] Add tooltips to buttons
- [ ] Fix mobile responsiveness issues
- [ ] Add keyboard shortcut hints to UI

### Medium
- [ ] Dice roller (d20, damage dice)
- [ ] Initiative auto-roller (from DEX modifier)
- [ ] Drag-and-drop initiative reordering
- [ ] Monster search with filters (CR, type, etc.)
- [ ] Encounter difficulty calculator
- [ ] Session audio notes (Web Audio API)

### Hard
- [ ] PDF character sheet import (PDF.js)
- [ ] Multi-DM collaboration (sync via WebRTC?)
- [ ] VTT integration (Roll20, Foundry)
- [ ] Automated monster stat block parsing (OCR/AI)
- [ ] Campaign sharing (export to URL with compression)

## 📝 Commit Message Format

We use conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting changes (no code change)
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

Examples:
```
feat: add initiative auto-roller
fix: resolve sidebar overlap issue
docs: improve README for non-technical users
refactor: extract combat logic to separate hook
```

## 🤝 Code of Conduct

- **Be respectful** - We're all volunteers here
- **Be patient** - Reviews may take time
- **Be constructive** - Feedback should help, not hurt
- **Be collaborative** - We succeed together

## ❓ Questions?

- Open a GitHub Discussion
- Comment on an issue
- Reach out to maintainers

## 🙏 Thank You!

Every contribution, no matter how small, makes this tool better for the D&D community. Thank you for being part of this project!

---

**Happy coding, and may your rolls be high!** 🎲
