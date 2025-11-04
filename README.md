# QA Influencers Ranking 🏆

> Discover and follow the most influential QA professionals worldwide based on LinkedIn followers and community impact.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Management](#data-management)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**QA Influencers Ranking** is a community-driven platform that ranks Quality Assurance professionals by their LinkedIn follower count. Our mission is to:

- **Increase visibility** for talented QA professionals
- **Help the community** discover new voices and experts
- **Track trends** in QA leadership and influence over time
- **Celebrate diversity** across countries and regions

> **Note:** Follower count is just one metric of influence. It doesn't determine who is the "best" QA professional, but it does indicate community reach and visibility.

---

## ✨ Features

### MVP (Current)
- ✅ **Global Ranking** - Top 10-20 QA professionals worldwide
- ✅ **Profile Cards** - Name, photo, followers, LinkedIn link
- ✅ **Position Tracking** - Visual indicators for rank changes (↑ ↓ ─)
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Fast Performance** - Static generation with Next.js
- ✅ **Clean UI** - Modern, accessible design with Tailwind CSS

### Roadmap (Future)
- 🚧 **Country Rankings** - Brazil, US, UK, etc.
- 🚧 **State Rankings** - Regional rankings (e.g., São Paulo, California)
- 🚧 **Filter & Search** - Find professionals by location or name
- 🚧 **Historical Charts** - Track follower growth over time
- 🚧 **Multiple Metrics** - YouTube, Twitter/X, GitHub, conferences, books
- 🚧 **Automated Updates** - LinkedIn API integration
- 🚧 **User Submissions** - Community can suggest profiles

---

## 🚀 Demo

### Live Site
Coming soon! Deploy instructions in [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Screenshots

**Desktop View:**
```
┌─────────────────────────────────────────────┐
│  🏆 QA Influencers Ranking                  │
│  Top Quality Assurance Professionals        │
├─────────────────────────────────────────────┤
│  Rank │ Professional  │ Followers │ Change  │
│   🏆  │ Angie Jones   │   250K    │  +2 ↑  │
│   🏆  │ Bas Dijkstra  │   45K     │  -1 ↓  │
│   🏆  │ Júlio de Lima │   38K     │  +1 ↑  │
└─────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend & Backend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Icon library

### Data
- **JSON Files** (MVP) - Simple, version-controlled data storage
- **Future:** PostgreSQL or SQLite for scalability

### Deployment
- **Vercel** - Recommended for zero-config deployment
- **VPS** - Docker + Nginx + PM2 for self-hosting
- See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full options

---

## 🏁 Getting Started

### Prerequisites

- **Node.js 20+** and **npm** or **yarn**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qa-influencers-ranking.git
cd qa-influencers-ranking

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

---

## 📁 Project Structure

```
qa-influencers-ranking/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage (ranking page)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── RankingCard.tsx    # Individual professional card
│   ├── RankingTable.tsx   # Desktop table view
│   ├── Header.tsx         # Site header
│   └── Footer.tsx         # Site footer
├── lib/                   # Utility functions
│   ├── ranking.ts         # Ranking calculation logic
│   └── data.ts            # Data fetching functions
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
├── data/                  # Data storage (JSON)
│   └── qa-professionals.json  # Ranking data
├── docs/                  # Documentation
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── LINKEDIN_DATA_COLLECTION.md  # Data collection strategies
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── next.config.js         # Next.js config
```

---

## 📊 Data Management

### Data Structure

Rankings are stored in `data/qa-professionals.json`:

```json
{
  "lastUpdate": "2025-11-04T00:00:00Z",
  "snapshots": [
    {
      "date": "2025-11-04T00:00:00Z",
      "type": "global",
      "professionals": [
        {
          "id": "1",
          "name": "Angie Jones",
          "profilePicture": "https://...",
          "linkedinUrl": "https://linkedin.com/in/angiejones",
          "followers": 250000,
          "location": {
            "country": "United States",
            "countryCode": "US"
          },
          "title": "VP of Developer Relations",
          "company": "TBD",
          "lastUpdated": "2025-11-04T00:00:00Z"
        }
      ],
      "totalCount": 10
    }
  ]
}
```

### Updating the Ranking

#### Manual Update (Current Method)

1. Edit `data/qa-professionals.json`
2. Add a new snapshot with updated follower counts
3. Keep the previous snapshot for position change tracking
4. Commit and push to trigger deployment

```bash
git add data/qa-professionals.json
git commit -m "Update ranking - November 2025"
git push origin main
```

#### Automated Update (Future)

See [LINKEDIN_DATA_COLLECTION.md](./docs/LINKEDIN_DATA_COLLECTION.md) for strategies on:
- LinkedIn API integration
- Third-party data services (PhantomBuster, Apify)
- Browser automation (use with caution)
- Legal and ethical considerations

---

## 🗺 Roadmap

### Phase 1: MVP (Current) ✅
- [x] Global ranking (top 10-20)
- [x] Basic profile cards
- [x] Position change indicators
- [x] Responsive design
- [x] Manual data updates

### Phase 2: Enhanced Features 🚧
- [ ] Country-specific rankings (Brazil, US, UK, etc.)
- [ ] State/regional rankings
- [ ] Search and filter functionality
- [ ] Historical charts and trends
- [ ] Dark mode

### Phase 3: Community Features 🔮
- [ ] User-submitted profiles
- [ ] Voting/community ratings
- [ ] Profile verification badges
- [ ] Comments and testimonials

### Phase 4: Multi-Metric 🔮
- [ ] YouTube subscribers
- [ ] Twitter/X followers
- [ ] GitHub stars
- [ ] Conference talks
- [ ] Published books
- [ ] Composite "Influence Score"

### Phase 5: Automation 🔮
- [ ] LinkedIn API integration
- [ ] Automated data collection
- [ ] Real-time updates
- [ ] Email notifications for rank changes
- [ ] Admin dashboard

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Add a QA Professional

1. Fork the repository
2. Edit `data/qa-professionals.json`
3. Add the professional's information
4. Submit a pull request

**Criteria for inclusion:**
- Active QA professional
- Public LinkedIn profile
- Minimum 5,000 followers
- Contributes to QA community (blogs, talks, open source, etc.)

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/yourusername/qa-influencers-ranking/issues)

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Documentation

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to VPS, Vercel, Docker, or Netlify
- **[Data Collection Strategy](./docs/LINKEDIN_DATA_COLLECTION.md)** - How to collect LinkedIn data ethically

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- All the amazing QA professionals who inspire the community
- LinkedIn for providing a platform to connect professionals
- The open-source community for incredible tools

---

## 📮 Contact

- **Project Lead:** [Your Name](mailto:your.email@example.com)
- **Website:** https://qa-ranking.example.com (coming soon)
- **GitHub:** https://github.com/yourusername/qa-influencers-ranking

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code or data
- 📢 Sharing with the QA community

---

**Made with ❤️ for the QA community**
