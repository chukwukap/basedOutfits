# Closet

> Build a **highly mobile-optimized** frontend for a mini app called **Closet** — a social platform for discovering and tipping fashion Looks.
>
> **Context:**
>
> - Logged-in user is obtained from Farcaster’s user context. No login page needed.
> - Payments: offer **Basepay** and **Wallet Sign** at checkout.
> - Goal: **Instagram-level polish** in a minimal MVP.
> - Tech stack: React + TailwindCSS. Minimal extra dependencies.
> - Focus on smooth performance, responsive design, and premium look.
>
> **Core Screens:**
>
> 1. **Feed Page** (landing)
>    - Infinite scroll grid feed (2 columns on mobile).
>    - Each Look card:
>      - Photo/video thumbnail
>      - Stylist name, city
>      - Like count & Tip icon
>    - Tap → Look Detail page.
> 2. **Look Detail Page**
>    - Top: full-width carousel (image/video).
>    - Info section: category, season, occasion, shopping links.
>    - Buttons: **Tip Stylist**, **Save to Closet**, **Add to Board**.
>    - Show total tips earned.
> 3. **Tip Modal**
>    - Choose tip amount.
>    - Select payment method (**Basepay** or **Wallet Sign**).
>    - 1-tap payment confirmation.
> 4. **Closet Page**
>    - User’s saved Looks (grid view).
> 5. **Boards Page**
>    - User’s public boards (grid of boards with cover + name).
>
> **Navigation:**
>
> - Fixed bottom nav bar (Feed, Closet, Boards, Profile).
> - Profile: shows stylist info & their posted Looks.
>
> **UI & UX Requirements:**
>
> - Mobile-first, touch-friendly, **premium** feel.
> - Fast image loading with blurred placeholders.
> - Large tap targets, generous spacing.
> - Smooth micro-interactions (tap, hover, transition).
> - Modular, reusable components.
> - Light color palette, soft shadows, clean typography.
> - Works flawlessly on iOS Safari & Android Chrome.
>
> **Moodboard Keywords for Style:**
>
> - _"Clean fashion editorial"_, _"Pinterest board aesthetic"_, _"Instagram Explore page"_, _"Subtle glassmorphism"_, _"Neutral tones with accent color for CTAs"_, _"Luxury streetwear brand look"_, _"High-contrast typography"_, _"Elegant rounded corners"_, _"Minimal iconography"_.
>
> **Example Visual References:**
>
> - Pinterest mobile grid layout
> - Instagram Explore feed
> - Depop product card spacing
> - Vogue mobile editorial layout
> - Poshmark product detail page
>
> Deliver as **clean, maintainable React + Tailwind code**, optimized for small screens with smooth animations. Avoid unnecessary libraries.

---

---

**Prompt for v0**

> **Task:** Update our mini app’s Home page to include a **social-first top bar with light filtering** that is highly mobile optimized.
>
> **Requirements:**
>
> 1. **Sticky Top Bar**
>    - **Left:** Small app logo or name.
>    - **Middle:** Horizontally scrollable “Trending Tags” chips (rounded pill buttons). Example tags: `#Streetwear`, `#SummerFits`, `#Minimalist`, `#OfficeChic`.
>      - The tags should auto-scroll slowly (like TikTok trending topics).
>      - Tapping a tag filters the feed to only show looks with that tag.
>    - **Right:** Small toggle button to switch between “All Looks” and “Following” feed.
> 2. **Feed Behavior**
>    - Default: Mixed global feed sorted by Trending + Recent.
>    - When a tag is selected, filter to only posts with that tag.
>    - When “Following” is active, show posts only from creators the user follows.
> 3. **Discover Creators Strip (Optional)**
>    - Below the feed, add a horizontally scrollable strip of suggested creators based on tags viewed.
>    - Each creator card: small profile picture, username, and “Follow” button.
>
> **Design Notes:**
>
> - Keep all components fully mobile responsive.
> - Prioritize speed and smooth scrolling.
> - Make the trending chips visually distinct (slightly elevated, bold text).
> - The feed should feel dynamic and “alive,” like Instagram Explore meets Pinterest.
>
> **Tech Notes:**
>
> - No login screen needed (user context comes from Farcaster).
> - Keep the filtering logic light — it can be client-side for MVP with mock/tagged data.
> - Don’t break existing tipping and collecting flows.

---

---

**Prompt for v0**

> **Task:** Improve the UX of the Home page feed to mimic top-tier social apps (Twitter, Instagram, TikTok) by making the header and bottom nav **context-aware** during scrolling.
>
> **Requirements:**
>
> 1. **Scroll-Aware Header & Bottom Nav**
>    - When the user scrolls **down** in the feed:
>      - Gradually slide the top header bar upward until mostly hidden (keep \~5–10px visible for context).
>      - Gradually slide the bottom navigation bar downward until mostly hidden.
>    - When the user scrolls **up**:
>      - Smoothly reveal both the header and bottom nav fully again.
>    - Use easing animations for a natural feel (no snapping).
>
> 2. **Mobile Optimization**
>    - Ensure animations are smooth and do not cause layout shift.
>    - Prioritize scroll performance — target 60fps.
> 3. **Behavior Notes:**
>    - The “Trending Tags” chips in the top header should also scroll away with the header.
>    - The hide/show should be subtle and not disruptive.
>    - Works seamlessly with infinite scroll.
>
> **Design Reference:**
>
> - Look at how **Twitter mobile** hides its top bar when you scroll down and reappears on upward scroll.
> - Look at how **Instagram Explore** behaves similarly.
>
> **Tech Notes:**
>
> - Can be implemented with scroll listeners + CSS transforms (translateY).
> - Avoid repaint-heavy operations — use `transform` rather than `top`/`bottom` CSS changes for performance.

---

---

**Prompt for v0:**

> **Feature:** Add the "Lookbook" feature to the app, replacing any mentions of "Board" and "Collect."
>
> **Purpose:** Users can create and manage multiple Lookbooks to organize outfits and styles they like. Each Lookbook is a themed folder that stores saved looks from other users or their own posts.
>
> **Requirements:**
>
> 1. **Lookbook List Page**
>    - Accessible from bottom navigation ("Lookbooks" icon).
>    - Displays a list/grid of the user’s Lookbooks.
>    - Each Lookbook card shows:
>      - Lookbook name
>      - Thumbnail (latest look added)
>      - Number of looks inside
>
>    - Floating "Create New Lookbook" button (FAB) at bottom right.
>
> 2. **Create/Edit Lookbook Modal**
>    - Fields: Lookbook name, optional description.
>    - Option to upload/select a cover image.
>    - “Save” button to confirm.
>
> 3. **Lookbook Details Page**
>    - Header with Lookbook title, cover image, and description.
>    - Grid display of saved looks (cards same as home feed but smaller).
>    - Option to rename or delete Lookbook.
>
> 4. **Add to Lookbook Flow**
>    - From any look in the feed or details page, an "Add" button should appear.
>    - Clicking "Add" opens a bottom sheet with:
>      - List of existing Lookbooks (with “+ Create New Lookbook” at top).
>      - Tap to select Lookbook → look is added instantly with a success toast.
>
> 5. **Mobile-Optimized UI/UX**
>    - Smooth animations for adding and removing looks.
>    - Responsive grid layouts that adapt to device width.
>    - Tap targets large enough for thumbs.
>    - Infinite scroll on Lookbook details page.
>
> 6. **Social Integration**
>    - Users can view others’ public Lookbooks from their profile.
>    - Public Lookbooks have a "Follow" option to get updates when new looks are added.
>
> 7. **Polish & Branding**
>    - Replace all "Collect" and "Board" references with "Add" and "Lookbook."
>    - Maintain the app’s current color scheme and typography.
>    - Add subtle micro-interactions (button presses, hover states, animations).
>
> **Goal:** The Lookbook feature should feel like a natural extension of the home feed, easy to access, and encourage users to organize and revisit looks. It should be smooth, stylish, and highly mobile-friendly.

---
