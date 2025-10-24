# Advanced Task Tracker PWA - Design Guidelines

## Design Approach

**Framework:** Material Design 3 + Modern Productivity App Patterns
**References:** Linear (clean efficiency), Notion (flexible organization), Todoist (task focus)
**Philosophy:** Function-first design with delightful micro-interactions that reward productivity

## Core Design Principles

1. **Clarity Over Cleverness** - Every element serves user productivity
2. **Immediate Feedback** - Visual confirmation for all actions
3. **Progressive Disclosure** - Show complexity only when needed
4. **Rewarding Experience** - Gamification feels earned, not gimmicky

## Typography System

**Font Stack:** 
- Primary: Inter or SF Pro (via Google Fonts CDN)
- Monospace: JetBrains Mono for timers/stats

**Type Scale:**
- H1 (Dashboard headers): 32px/2rem, bold
- H2 (Section titles): 24px/1.5rem, semibold
- H3 (Card headers): 18px/1.125rem, medium
- Body (Task text): 16px/1rem, regular
- Small (Metadata): 14px/0.875rem, regular
- Tiny (Badges/labels): 12px/0.75rem, medium

**Line Heights:**
- Headers: 1.2
- Body text: 1.5
- Compact lists: 1.4

## Layout System

**Spacing Primitives (Tailwind units):**
- Micro: 1, 2 (4px, 8px) - tight spacing, icon gaps
- Standard: 4, 6 (16px, 24px) - component padding, card gaps
- Section: 8, 12 (32px, 48px) - major section separation

**Grid Structure:**
- Mobile: Single column, full-width cards
- Tablet: 2-column for task lists, side navigation appears
- Desktop: 3-column max (sidebar + main + detail panel), max-width 1400px

**Container Max-widths:**
- Task list view: max-w-4xl centered
- Dashboard analytics: max-w-7xl for charts
- Kanban boards: full-width with horizontal scroll

## Component Library

### Navigation
**Mobile:** Bottom tab bar (fixed) with 4-5 primary sections - Tasks, Today, Analytics, Profile
**Desktop:** Persistent sidebar (240px width) with collapsible project/category tree structure
**Top App Bar:** Always present with search icon, add task button, notifications bell, profile avatar

### Task Cards
**Structure:**
- Checkbox (28px) aligned left with 4-unit gap to content
- Title (body size, 2-line max with ellipsis)
- Metadata row: due date, category badge, priority indicator (in that order)
- Swipe reveal: Complete (green) swipe right, Delete (red) swipe left with undo snackbar
- Long-press: Quick action menu with backdrop

**Visual Hierarchy:**
- Elevated cards with subtle shadow (elevation-1 in Material Design)
- 4-unit padding inside cards
- 3-unit gap between cards in lists
- Priority: Vertical accent strip (4px) on left edge, not full card background

### Gamification Elements
**XP Progress Bar:**
- Thin (8px height) horizontal bar showing level progress
- Positioned in profile header or dashboard top
- Smooth animated fill on updates

**Badge Grid:**
- 3-column grid on mobile, 4-5 on desktop
- Locked badges at 40% opacity with lock icon overlay
- Earned badges: full opacity, subtle glow animation on earn

**Streak Counter:**
- Prominent fire emoji + number in dashboard hero
- Secondary text: "Day streak" below counter
- Confetti animation on milestone days (7, 30, 100)

### Analytics Dashboard
**Layout:**
- Productivity heatmap: Full-width calendar grid (7 columns for days)
- Chart grid: 2-column on desktop (pie + line charts), stacked on mobile
- Stats cards: 4-card row showing key metrics (completion rate, avg time, tasks today, total XP)

**Chart Styling (Chart.js):**
- Minimalist axes, no heavy gridlines
- Data point highlights on hover
- Consistent spacing: 8-unit padding around charts
- Responsive: stack vertically on mobile, side-by-side on desktop

### Pomodoro Timer
**Design:**
- Large circular progress ring (240px diameter) centered in focus view
- Time display: 48px monospace font inside ring
- Control buttons below: Start/Pause (primary large), Skip, Reset (secondary smaller)
- Session count: Small dots indicator below controls
- Full-screen focus mode option: minimal UI, timer + ambient background

### Kanban Board
**Column Structure:**
- Fixed 320px column width, horizontal scroll on overflow
- Column header: Title + count badge + add button
- Cards: Simplified task cards (lighter than list view)
- Drag handle: Visible on hover (6-dot grip icon)
- Drop zones: Highlighted with dashed border on drag

### Forms & Inputs
**Task Creation:**
- Modal/bottom sheet on mobile, sidebar panel on desktop
- Autofocus on title field
- Inline date picker (calendar icon trigger)
- Tag selector: Chip input with autocomplete dropdown
- Priority selector: Radio buttons with color indicators
- Rich text editor (Quill.js): Minimal toolbar, appears on focus

**Input Styling:**
- Outlined style (Material Design)
- 48px touch target height on mobile
- 4-unit vertical spacing between form fields
- Clear error states: Red outline + helper text below

### Modals & Overlays
**Task Detail Modal:**
- Mobile: Full-screen slide-up
- Desktop: Centered modal (600px width), backdrop blur
- Header: Title + close button
- Body: Scrollable content with 6-unit padding
- Footer: Action buttons (sticky on mobile)

**Confirmation Dialogs:**
- Centered, max-width 400px
- Icon + message + two-button layout (cancel left, confirm right)

## Animations & Transitions

**Micro-interactions:**
- Task complete: Checkbox animates to checkmark, card fades + slides out (300ms)
- XP gain: +XX number floats up and fades (500ms ease-out)
- Badge unlock: Scale-in + glow pulse (400ms)
- Swipe actions: Card translates with touch, spring back if incomplete

**Page Transitions:**
- View changes: 200ms fade + subtle slide (16px vertical)
- Modal appearance: 250ms scale + fade from 0.95 to 1
- Bottom sheet: Slide up from bottom (300ms ease-out)

**Performance:** Use `transform` and `opacity` only for animations, avoid layout thrashing

## Mobile-First Responsive Strategy

**Breakpoints:**
- Mobile: < 640px (base styles)
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptations:**
- Mobile: Bottom nav, full-width cards, stacked layouts, hamburger menu
- Tablet: Side nav appears, 2-column grids, some sidebars
- Desktop: Persistent sidebars, multi-panel layouts, hover states prominent

## Accessibility Standards

**Touch Targets:**
- Minimum 44px × 44px for all interactive elements
- Spacing between targets: 8px minimum

**Keyboard Navigation:**
- Visible focus rings (2px outline with 2px offset)
- Tab order follows visual hierarchy
- Shortcuts: `N` new task, `S` search, `/` focus search, `Esc` close modals

**Screen Readers:**
- ARIA labels on icon-only buttons
- Live regions for toast notifications
- Semantic HTML: `<nav>`, `<main>`, `<article>` for task cards

## Images

**Hero Section:** Not applicable - this is a productivity app, not a marketing site. Dashboard leads with personalized greeting + stats cards.

**Illustrations:**
- Empty states: Use simple SVG illustrations (undraw.co style) for "No tasks yet", "All caught up"
- Achievement badges: Icon-based (no complex imagery), 64×64px SVGs
- Profile avatars: 40px circular, initials fallback if no image

**Icons:**
- Use Heroicons (outline style) via CDN for all UI icons
- Consistent 24px size for nav/toolbar, 20px for inline
- Task category icons: Keep simple, recognizable glyphs

## PWA-Specific Considerations

**Installability:**
- Manifest icons: 192px and 512px PNG versions
- Splash screen: Simple logo + app name on solid background
- App icon: Recognizable task checkmark symbol, works at all sizes

**Offline UI:**
- Subtle banner when offline: "Working offline" with sync icon
- Optimistic UI: Show changes immediately, sync indicator in corner
- Failed actions: Clear error toast with retry option

**Loading States:**
- Skeleton screens for initial load (match card structure)
- Inline spinners for actions (button loading state)
- Shimmer effect on skeletons (subtle animation)

## Visual Hierarchy Patterns

**Dashboard Priority:**
1. Today's task count (largest, top)
2. Streak indicator (prominent, rewarding)
3. Quick add task (always accessible)
4. Navigation to other sections

**Task List Priority:**
1. Overdue tasks (visual emphasis)
2. Today's tasks
3. Upcoming tasks (subdued)
4. Completed (collapsed by default)

**Data Density:**
- Comfortable: Standard view with full metadata, generous spacing
- Compact mode option: Reduce padding from 4 to 2 units, hide secondary metadata
- Maximum information per screen without scrolling on common viewports

This design creates a professional, efficient productivity tool that feels native on mobile while scaling beautifully to desktop. The gamification elements add delight without compromising the serious work of task management.