# 🎲 D&D 5e DM Tool

A free, open-source tool for Dungeon Masters to manage combat, track monsters, and organize campaigns. **Everything runs in your browser - no account required, no data sent to servers.**

## 🌟 For Dungeon Masters (Non-Technical Guide)

### What is this?

This is a web-based app that helps you run D&D games more smoothly. Think of it like a digital DM screen that:
- Tracks combat initiative and hit points
- Stores your monsters and NPCs
- Keeps session notes and campaign info
- Works offline (even without internet!)
- Never loses your data (stored locally on your computer)

### How do I use it?

1. **First Time Setup:**
   - Someone with technical knowledge needs to set this up once (see "For Developers" section below)
   - Once set up, you can access it through your web browser (Chrome, Firefox, Edge, etc.)
   - Bookmark the page for easy access!

2. **Getting Started:**
   - **Create a Campaign**: Click "New Campaign" in the sidebar to create your first campaign
   - **Quick Combat**: Need to track initiative fast? Use "Quick Combat" - no campaign setup needed!
   - **Add Monsters**: Go to the "Monsters" page to add creatures from your books or import from D&D's free content
   - **Start Combat**: When battle begins, use the "Combat" page to track everyone's HP, conditions, and turn order
   - **Take Notes**: Use "Sessions" to record what happened each game night

3. **Important Tips:**
   - **Your Data is Safe**: Everything is saved automatically in your browser. You don't need to click "Save"
   - **Use the Same Browser**: Your data stays in whichever browser you use (Chrome, Firefox, etc.). Switching browsers means starting fresh
   - **Backup Your Data**: Go to "Tools" → "Export All Data" to download a backup file. Do this regularly!
   - **Restore Data**: If you need to move to a new computer or browser, use "Import Data" to upload your backup file
   - **Dark Mode**: The app defaults to dark mode (easier on the eyes!). Toggle it in the sidebar if you prefer light mode

### Features Explained

#### Quick Combat Tracker 🎯
The simplest way to track combat. Just add names and initiative numbers. Perfect for random encounters or when you don't want to set up a whole campaign.

#### Full Combat Tracker ⚔️
For planned battles. Tracks:
- Initiative order (automatically sorted!)
- Hit points (damage and healing)
- Conditions (poisoned, stunned, etc.)
- Rounds and turns

#### Monster Database 📚
Store all your creatures in one place:
- Add monsters from your books manually
- Import free monsters from the official D&D SRD
- Include stat blocks, abilities, and actions
- Quick reference during combat

#### Player Characters 👥
Keep track of your players' characters:
- Basic stats (HP, AC, ability scores)
- Spell lists and features
- Quick reference when you need to look something up

#### NPCs 🗣️
Track important non-player characters:
- Names, roles, and locations
- Backstory and notes
- Relationships and quest hooks

#### Session Notes 📝
Record what happens each game:
- Session recaps
- Quest progress
- Important decisions
- Campaign timeline

#### Reference Tools 🔍
Quick lookups during the game:
- **Spell Lookup**: Search any SRD spell (name, level, school)
- **Condition Reference**: What does "Restrained" do again? Quick lookup!

### Frequently Asked Questions

**Q: Will I lose my data if I close the browser?**
A: No! Everything is saved automatically and will be there when you come back.

**Q: Can I use this on my tablet?**
A: Yes! It works on desktop, laptop, and tablet. Best experience on larger screens.

**Q: Can my players access my data?**
A: Not unless you give them access to your computer/browser. Each person has their own separate data.

**Q: Can I have multiple campaigns?**
A: Absolutely! Use the campaign selector in the sidebar to create and switch between campaigns.

**Q: What if I switch computers?**
A: Export your data from the old computer (Tools → Export All Data), then import it on the new one!

**Q: Does this need internet?**
A: After the first load, it works offline! The only time you need internet is to import monsters from the online database.

**Q: Is this really free?**
A: 100% free and open source. No hidden costs, no subscriptions, no ads.

---

## 💻 For Developers

### What is this technically?

A Progressive Web App (PWA) built with Next.js that uses IndexedDB for local-first data storage. All game data stays on the user's device with optional JSON export/import for backup/transfer.

### Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Local Database**: Dexie.js (IndexedDB wrapper)
- **State Management**: Zustand
- **Icons**: Lucide React + Font Awesome (d20 icon)
- **PWA**: next-pwa
- **External API**: Open5e (for SRD monster/spell data)

### Getting Started

#### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dm-tool.git
cd dm-tool

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Building for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Deployment Options

#### Option 1: Vercel (Recommended)
1. Fork this repository
2. Import project to Vercel
3. Deploy (zero configuration needed)
4. Share the URL with your DM

#### Option 2: Netlify
1. Fork this repository
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

#### Option 3: Self-Hosted
```bash
npm run build
npm start
# Runs on http://localhost:3000
```

Or use a static server:
```bash
npm run build
npx serve@latest out
```

### Generating PWA Icons

The app uses a d20 SVG icon located at `app/icon.svg` and `public/icon.svg`. For full PWA support, you should generate PNG icons:

1. **Using an online tool**:
   - Visit [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
   - Upload `public/icon.svg`
   - Generate icons (192x192 and 512x512 recommended)
   - Download and place in `public/` directory
   - Update filenames in `public/manifest.json`

2. **Using ImageMagick** (command line):
   ```bash
   # Install ImageMagick, then:
   convert public/icon.svg -resize 192x192 public/icon-192.png
   convert public/icon.svg -resize 512x512 public/icon-512.png
   ```

The SVG favicon will work in most modern browsers, but PNG icons provide better compatibility for PWA installation on mobile devices.

### Project Structure

```
dm-tool/
├── app/                    # Next.js app directory (routes)
│   ├── combat/            # Combat tracker page
│   ├── quick-combat/      # Standalone quick combat
│   ├── encounters/        # Encounter builder
│   ├── monsters/          # Monster CRUD
│   ├── characters/        # PC management
│   ├── npcs/             # NPC management
│   ├── sessions/         # Session notes
│   └── tools/            # Reference tools & export/import
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (sidebar, etc.)
│   ├── combat/           # Combat-related components
│   ├── monsters/         # Monster-related components
│   └── ...               # Feature-specific components
├── lib/                   # Utilities and core logic
│   ├── db/               # Dexie.js database layer
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── database.ts   # Database schema
│   │   ├── hooks.ts      # React hooks for queries
│   │   └── export.ts     # Export/import functionality
│   ├── stores/           # Zustand state stores
│   ├── api/              # External API integrations
│   ├── data/             # Static reference data
│   └── hooks/            # Custom React hooks
└── public/               # Static assets
```

### Key Files for Contributors

- `lib/db/database.ts` - Database schema definition
- `lib/db/types.ts` - TypeScript interfaces for all data models
- `lib/db/hooks.ts` - React hooks for database operations
- `lib/stores/` - Zustand stores for UI and combat state
- `components/` - All React components (well-organized by feature)

### Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** (see code comments for guidance)
4. **Test thoroughly** (combat, import/export, multi-campaign)
5. **Submit a pull request**

#### Code Style

- TypeScript strict mode enforced
- Use functional components with hooks
- Follow existing patterns for consistency
- Add comments for complex logic
- Use descriptive variable names

#### Areas for Improvement

- [ ] Dice roller (inline d20, damage rolls)
- [ ] PDF character sheet import
- [ ] Initiative auto-roll with dex modifiers
- [ ] Encounter difficulty calculator (CR-based)
- [ ] Drag-and-drop initiative reordering
- [ ] Mobile-optimized layouts
- [ ] Homebrew spell/item database
- [ ] Encounter templates (by environment/CR)
- [ ] Session audio notes (using Web Audio API)
- [ ] Shareable encounter links (export to URL)

### Data Privacy & Security

- **No server-side database**: All data stored in browser's IndexedDB
- **No authentication**: No user accounts or passwords
- **No tracking**: No analytics or telemetry
- **No external requests**: Except Open5e API (optional, only for importing SRD content)
- **Export format**: Plain JSON (human-readable, portable)

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Mobile browsers (works but not optimized)

### Database Schema

Uses Dexie.js with these tables:

- `campaigns` - Campaign metadata
- `characters` - Player characters
- `monsters` - Monster stat blocks
- `npcs` - Non-player characters
- `encounters` - Pre-built encounter templates
- `active_combat` - Current combat state
- `sessions` - Session notes and timeline

See `lib/db/types.ts` for full schema definitions.

### API Integration

**Open5e API** (https://api.open5e.com/)
- Free, no API key required
- SRD monsters and spells only (no copyrighted content)
- Used for importing reference data
- Falls back gracefully if offline

### License

MIT License - feel free to use, modify, and distribute!

See [LICENSE](LICENSE) file for full details.

### Support

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Feature requests and questions in GitHub Discussions
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon)

### Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) and [Font Awesome](https://fontawesome.com/)
- D&D 5e SRD data from [Open5e](https://open5e.com/)
- Inspired by DMs worldwide who need better tools! 🎲

---

**Made with ❤️ for the D&D community**
