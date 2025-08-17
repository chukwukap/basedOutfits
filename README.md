# Outfitly — Farcaster Miniapp for Fashion Inspiration

**Outfitly** is a highly social Farcaster miniapp for discovering, collecting, and sharing fashion outfits.
Users can browse outfits, collect their favorites into personal Lookbooks, and track creators whose style they love — all while staying inside the Farcaster ecosystem.

## ✨ Features

- **Social Outfit Discovery**
  - Scroll through an endless feed of user-submitted outfits.
  - Filter by category, style, season, or trending status.
  - Mobile-first UI with smooth disappearing headers & bottom nav on scroll (inspired by Twitter).

- **Outfit Details Page**
  - Full-screen photo(s) of the outfit.
  - Detailed outfit breakdown: brand, item type, pricing (optional).
  - Creator’s profile & other outfits.
  - Collect button (small fee in USDC) to save to your personal Outfitly.

- **Lookbooks (Boards)**
  - Organize collected outfits into themed boards (e.g., “Streetwear”, “Summer Fits”).
  - Public or private Lookbooks.
  - Share Lookbooks via Farcaster cast.

- **Style-Track System**
  - Contextual follow feature just for fashion content.
  - Track outfits from creators without following all their Farcaster posts.
  - Personal “Style Feed” based on tracked creators.

- **Collect to Closet**
  - Pay a small USDC fee to collect a outfit into your closet.
  - Closet is viewable only by you (or publicly if toggled).

- **Onboarding Tutorial**
  - Mobile-optimized step-by-step guide for first-time users.
  - Explains how to browse, collect, tip, and style-track.
  - Interactive tooltips on first visit.

- **Tipping Creators**
  - Support your favorite creators with USDC tips.
  - Tips are displayed on the Outfit’s detail page.

---

## 🛠 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Farcaster MiniKit
- **Backend:** Node.js (Express) + Prisma ORM
- **Database:** PostgreSQL
- **Payments:** Coinbase SpendPermissionManager (USDC)
- **Hosting:** Vercel (frontend) + Railway/Fly.io (backend)
- **Authentication:** Farcaster Sign-in

---

## 📦 Installation

```bash
git clone https://github.com/chukwukap/lookbook.git
cd lookbook
npm install
```

### Environment Variables

Create a `.env` file in the root and set:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXT_PUBLIC_MINIKIT_API_KEY=your_farcaster_minikit_key
COINBASE_API_KEY=your_coinbase_key
```

---

## 🚀 Development

Run locally:

```bash
npm run dev
```

Prisma commands:

```bash
npx prisma migrate dev
npx prisma studio
```

---

## 📐 Database Models

### Core Entities

- **User** — linked to Farcaster account.
- **Outfit** — outfit post with image, description, and details.
- **Outfitly** — collection of outfits.
- **StyleFollow** — tracks fashion-only follows.
- **Collection** — records when a user collects a outfit into a Outfitly.
- **Tip** — logs tips given to a creator for a outfit.

---

## 🎯 User Flows

1. **Onboarding**
   - First-time visitor sees a short tutorial.
   - Highlight feed, collect button, style-track, and tip feature.

2. **Browsing & Filtering**
   - Scroll feed, filter by category/style/trending.
   - Smooth hide/reveal header & nav on scroll.

3. **Viewing a Outfit**
   - Tap to see full details and related outfits.
   - Option to collect into a Outfitly (pay fee).
   - Tip creator or style-track them.

4. **Outfitly Management**
   - Create themed boards.
   - Organize collected outfits.
   - Share on Farcaster.

---

## 🔮 Roadmap

- [ ] Multi-image outfits.
- [ ] AI tagging for outfits.
- [ ] Notifications for new outfits from tracked creators.
- [ ] Seasonal/trend-based challenges.
