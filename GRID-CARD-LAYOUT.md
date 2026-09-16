# Grid & Card-Based Layout Structure

## Overview

Implemented proper mobile UI grid and card-based layouts following industry best practices from Tubik Studio's mobile UI design patterns. The app now uses structured grid systems, card-based components, and proper visual hierarchy.

## Layout Patterns Implemented

### 1. Home Screen — Dashboard Layout

**Structure:**
- **Header**: App name + verified badge
- **Hero Stats Card**: 3-column grid showing activity metrics (Likes, Matches, Messages)
- **Quick Actions Grid**: 2x2 grid of action cards (Discover, Matches, Messages, Settings)
- **Admin Tools**: List-based card layout with icons and chevrons
- **Recent Activity**: Feed-style list with avatars and timestamps

**Grid System:**
```
┌─────────────────────────┐
│  Header (Bae'd + Badge) │
├─────────────────────────┤
│  Stats Card (3-col)     │
│  [24]  [8]   [12]       │
│  Likes Matches Messages │
├─────────────────────────┤
│  Quick Actions (2x2)    │
│  ┌──────┐  ┌──────┐    │
│  │Discov│  │Matche│    │
│  └──────┘  └──────┘    │
│  ┌──────┐  ┌──────┐    │
│  │Messag│  │Settin│    │
│  └──────┘  └──────┘    │
├─────────────────────────┤
│  Admin Tools (List)     │
│  ┌───────────────────┐ │
│  │ ✓ Verification →  │ │
│  └───────────────────┘ │
│  ┌───────────────────┐ │
│  │ ⚠ Moderation →    │ │
│  └───────────────────┘ │
├─────────────────────────┤
│  Recent Activity (Feed) │
│  ┌───────────────────┐ │
│  │ ♥ New match...    │ │
│  ├───────────────────┤ │
│  │ 💬 Message from.. │ │
│  └───────────────────┘ │
└─────────────────────────┘
```

### 2. Discover Screen — Catalog Layout

**Structure:**
- **Header**: Title + filter button
- **Profile Card Stack**: Single large card with swipe gestures
- **Action Buttons**: Pass/Like buttons at bottom

**Card Design:**
- Full-bleed profile photo (aspect-ratio 3:4)
- Gradient overlay for text readability
- Verified badge with icon + text
- Name, age, occupation, city
- Bio (2-line clamp)
- Interest tags (max 3)
- Compatibility score

### 3. Matches Screen — Catalog + Horizontal Scroll

**Structure:**
- **Header**: Title + match count
- **New Matches**: Horizontal scroll row (5 items)
- **All Matches**: 2-column grid of match cards
- **Empty State**: Friendly message with icon

**Grid System:**
```
┌─────────────────────────┐
│  Matches (8 connections)│
├─────────────────────────┤
│  New Matches            │
│  ← [P1] [P2] [P3] →   │
├─────────────────────────┤
│  All Matches            │
│  ┌──────┐  ┌──────┐    │
│  │Photo │  │Photo │    │
│  │Name  │  │Name  │    │
│  │Age   │  │Age   │    │
│  └──────┘  └──────┘    │
│  ┌──────┐  ┌──────┐    │
│  │Photo │  │Photo │    │
│  │Name  │  │Name  │    │
│  │Age   │  │Age   │    │
│  └──────┘  └──────┘    │
└─────────────────────────┘
```

### 4. Chat Screen — Conversation Layout

**Structure:**
- **Header**: Back button + avatar + name + details
- **Messages**: Scrollable message list with bubbles
- **Input**: Fixed bottom input with send button

**Message Bubbles:**
- **My messages**: Rose background, white text, right-aligned
- **Their messages**: White background, ink text, left-aligned
- Timestamps in tiny text
- Rounded corners with directional tails

### 5. Settings Screen — List Layout

**Structure:**
- **Header**: Title
- **Profile Card**: Avatar + name + verified badge + edit button
- **Preferences**: List card with 3 items
- **Safety**: List card with 2 items
- **About**: List card with 3 items
- **Logout**: Danger button
- **Version**: Tiny text footer

**List Card Pattern:**
```
┌─────────────────────────┐
│  Item 1              →  │
├─────────────────────────┤
│  Item 2              →  │
├─────────────────────────┤
│  Item 3              →  │
└─────────────────────────┘
```

## Design Principles Applied

### 1. Grid Systems
- **2-column grids** for action cards and match cards
- **3-column grids** for stats display
- **Horizontal scroll** for new matches (peek pattern)
- **Single column** for list-based content

### 2. Card Patterns
- **Stats Card**: Elevated card with 3-column grid
- **Action Cards**: Compact cards with icon + title + description
- **List Cards**: Cards with dividers and chevrons
- **Profile Cards**: Full-bleed photo with overlay
- **Match Cards**: Square photo + name + details

### 3. Visual Hierarchy
- **Section Labels**: Uppercase, small, stone color
- **Card Titles**: Body size, semibold, ink color
- **Card Descriptions**: Tiny size, stone color
- **Dividers**: 0.5px line between list items
- **Chevrons**: Right-aligned navigation indicators

### 4. Spacing & Padding
- **Screen padding**: 16px (4 * spacing-4)
- **Card padding**: 12px (spacing-3)
- **Grid gaps**: 12px (spacing-3)
- **Section spacing**: 16px between sections
- **Bottom padding**: 80px to clear tab bar

### 5. Component Sizing
- **Icons**: 20px (w-5 h-5) for list items
- **Avatars**: 40px (w-10 h-10) for list items, 56px for profile
- **Buttons**: 44px height minimum
- **Cards**: Full width with 12px radius

## Mobile UI Patterns

### 1. Splash Screen
- Minimal, centered layout
- Logo + tagline
- Loading spinner
- Fast transition (1.5s)

### 2. Onboarding Screens
- Single-column layout
- Large headline (DM Serif Display)
- Clear value proposition
- Single CTA button

### 3. Home Screen
- Dashboard with stats
- Grid-based quick actions
- List-based admin tools
- Feed-style recent activity

### 4. Catalog Screen (Discover)
- Single large card
- Swipe gestures
- Action buttons at bottom
- Filter button in header

### 5. Product Card Screen (Profile Detail)
- Full-bleed photo
- Overlay with gradient
- Structured information blocks
- Action buttons at bottom

### 6. Feed Screen (Matches)
- Horizontal scroll for new items
- Grid layout for all items
- Empty state with friendly message

### 7. Contacts Screen (Chat)
- Conversation list
- Message bubbles
- Fixed input at bottom
- Avatar + name header

### 8. Profile Screen (Settings)
- Profile card at top
- List-based sections
- Clear navigation with chevrons
- Logout button at bottom

## Technical Implementation

### Grid Classes Used
```tsx
grid grid-cols-2 gap-3      // 2-column grid
grid grid-cols-3 gap-3      // 3-column grid
flex gap-3 overflow-x-auto  // Horizontal scroll
space-y-3                   // Vertical stack with spacing
```

### Card Classes Used
```tsx
card                        // Standard card (ivory bg)
card-elevated              // Elevated card (white bg, shadow)
card-sand                  // Sand background card
```

### List Pattern
```tsx
<div className="card">
  <div className="space-y-3">
    <button className="flex items-center justify-between">
      <span>Item 1</span>
      <ChevronRight />
    </button>
    <div className="divider"></div>
    <button className="flex items-center justify-between">
      <span>Item 2</span>
      <ChevronRight />
    </button>
  </div>
</div>
```

## Build Stats

```
✓ 106 modules transformed
CSS: 36.77 kB (7.67 kB gzip)
JS: 244.56 kB (68.91 kB gzip)
```

## References

- [Tubik Studio: 15 Basic Types of Mobile Screens](https://tubikstudio.com/blog/mobile-ui-design-15-basic-types-of-screens/)
- Mobile UI design patterns for catalog, feed, contacts, and profile screens
- Grid-based layouts for better information architecture
- Card-based components for visual consistency

## Summary

The app now follows proper mobile UI design patterns with:
- ✅ Grid-based layouts (2-col, 3-col, horizontal scroll)
- ✅ Card-based components (stats, actions, lists, profiles)
- ✅ Proper visual hierarchy (labels, titles, descriptions)
- ✅ Consistent spacing and padding
- ✅ Native app feel with proper screen types
- ✅ Clear navigation with chevrons and dividers
- ✅ Responsive design that works on all screen sizes
