# Outfitly — Farcaster Miniapp for Fashion Inspiration

**Outfitly** is a highly social miniapp for discovering, collecting, and sharing fashion outfits.
Users can browse outfits, collect their favorites into personal Wardrobes, and track creators whose style they love — all while staying inside the Farcaster ecosystem.

## ✨ Features

- **Social Outfit Discovery**
  - Scroll through an endless feed of user-submitted outfits.
  - Filter by category, style, season, or trending status(coming soon)
  - Mobile-first UI with smooth disappearing headers & bottom nav on scroll.

- **Outfit Details Page**
  - Full-screen photo(s) of the outfit.
  - Detailed outfit breakdown: brand, item type, pricing (optional).
  - Creator’s profile & other outfits.
  - Add button (small fee in USDC) to save to your personal Wardrobe.

- **Wardrobes (Boards)**
  - Organize collected outfits into themed Wardrobes (e.g., “Streetwear”, “Summer Fits”).
  - Public or private Wardrobes.
  - Share Wardrobes via Farcaster cast.

- **Style-Track System**
  - Track outfits from creators by liking their Outfitly posts.
  - Personal “Style Feed” based on tracked creators.

- **Add to Wardrobe**
  - Pay a small USDC fee to add a outfit into your wardrobe.
  - Wardrobe is viewable only by you (or publicly if toggled).

- **Onboarding Tutorial**
  - Mobile-optimized step-by-step guide for first-time users.
  - Explains how to browse, add, tip, and style-track.
  - Interactive tooltips on first visit.

- **Tipping Creators**
  - Support your favorite creators with USDC tips.
  - Tips are displayed on the Outfit’s detail page.

---

## 🛠 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Farcaster MiniKit
- **Backend:** Node.js (Express) + Prisma ORM
- **Database:** PostgreSQL
- **Payments:** BasePay
- **Hosting:** Vercel (frontend + backend)

---

## 🎯 User Flows

1. **Onboarding**
   - First-time visitor sees a short tutorial.
   - Highlight feed, add button, style-track, and tip feature.

2. **Browsing & Filtering**
   - Scroll feed, filter by category/style/trending.
   - Smooth hide/reveal header & nav on scroll.

3. **Viewing a Outfit**
   - Tap to see full details and related outfits.
   - Option to collect into a Wardrobe (pay fee).
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
