# 🎨 UI/UX DESIGN PROMPT — GOOGLE STITCH AI
## EtalaseKu Digital Hub & Academy

Dokumen ini berisi panduan identitas visual lengkap (palet warna HEX, tipografi, radius kartu, bayangan elevasi) dan prompt desain resolusi tinggi siap pakai untuk **Google Stitch AI**.

---

### Ringkasan Palet Desain
- **Canvas Background**: `#FFFDF9` (Warm Cream / Ivory)
- **Wave Section 1**: `#FDEEF1` (Soft Pastel Pink)
- **Wave Section 2**: `#F3EDFD` (Soft Pastel Lavender)
- **Wave Section 3**: `#E8F8F5` (Soft Pastel Mint)
- **Primary Accent**: `#FF2E63` (Vibrant Hot Pink)
- **Secondary Dark**: `#0F172A` (Deep Midnight Navy)
- **Surface / Cards**: `#FFFFFF` (Pure White, Radius 20px, Soft Shadow)
- **Success State**: `#10B981` (Fresh Emerald Green)
- **Warning / Waitlist**: `#F59E0B` (Warm Amber Gold)

---

```text
Design a complete, high-converting visual UI/UX for EtalaseKu Digital Hub & Academy.
EtalaseKu is an all-in-one digital product storefront, e-learning academy, and sales automation platform powered by Google Workspace. The web app features an inviting, playful-yet-professional modern tech aesthetic with pastel wavy section dividers, floating rounded cards, high-contrast action buttons, an instant checkout and waitlist flow, a distraction-free member learning portal, and an admin management dashboard with revenue analytics.

## Design Identity
- Style: Modern Playful-Professional & High-Converting SaaS (Warm, Friendly, Confident)
- Aesthetic: Soft pastel wavy canvas transitions, floating white cards with delicate drop shadows, rounded pill badges, playful hand-drawn tech illustrations (laptop mockups, smartphone frames, coffee mug, succulent plant, code tags, sparkle stars, and high-five banner).
- Color Palette:
  Primary Accent: Vibrant Hot Pink #FF2E63 (hover: #E11D48)
  Secondary Dark: Deep Midnight Navy #0F172A (hover: #1E293B)
  Canvas Background: Warm Cream / Ivory #FFFDF9
  Wave Tint 1 (Pink Wave): #FDEEF1
  Wave Tint 2 (Lavender Wave): #F3EDFD
  Wave Tint 3 (Mint Wave): #E8F8F5
  Surface / Cards: Pure White #FFFFFF
  Body Text: Slate Charcoal #334155
  Headings & Labels: Deep Navy #0F172A
  Border / Outlines: #E2E8F0 (focused: #FF2E63)
  Success Badge: Background #DCFCE7, Text #166534, Border #86EFAC
  Warning / Waitlist Badge: Background #FEF9C3, Text #854D0E, Border #FDE047
  Danger / Full Badge: Background #FEE2E2, Text #991B1B, Border #FCA5A5
- Typography:
  Primary Font: 'Plus Jakarta Sans', sans-serif (Geometric, modern, humanistic)
  Heading Scale: H1 44px bold (mobile: 32px), H2 32px bold, H3 22px semibold, Body 15px regular, Caption 12px medium.
  Tabular / Numbers: 'Inter', sans-serif for KPI metrics and data tables.
- Icons: Clean Lucide / Heroicons outline style (20px & 24px) with soft rounded edges.
- Corner Radius: 20px for content cards, 12px for form inputs, 9999px (full-pill) for CTA buttons and status badges.
- Shadows: Card Elevation: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03).
- Spacing: 8px base grid system (paddings: 16px, 24px, 32px, 48px, 64px).

## Application Overview
The application consists of 3 integrated modules across 12 specific screens:
1. Public Storefront & Conversion Funnel: High-converting landing page, mobile breakpoint, modal checkout, and waitlist flow.
2. Member Learning Classroom: Passwordless member area with YouTube Unlisted video player, progress tracking, and Google Drive resource downloads.
3. Admin Operations & CRM: PIN authentication, revenue analytics dashboard, 1-click transaction split-review, course builder, CRM leads panel, and dynamic site settings.

---

### SCREEN 01: PUBLIC LANDING PAGE (DESKTOP)
Full-width desktop landing page on #FFFDF9 canvas featuring curved pastel section dividers and floating cards.
- Sticky Announcement Bar: Height 40px, background #0F172A, centered white text (13px, font-weight 500) "🔥 PROMO: 50% OFF - Lifetime Access for Batch 3 (Only 8 Seats Left!)" with a glowing pink dot and [x] close icon.
- Top Navigation Bar: Height 72px, transparent background with soft blur on scroll. Left: Logo "SH. EtalaseKu Hub" with pink period dot. Center: Nav links (Home, Categories, Selected Work, Curriculum, Testimonials) with navy text and pink underline indicator on active. Right: Pill button [Access Classroom 🔑] (Outlined #0F172A, hover: fills #0F172A with white text).
- Hero Section:
  - Background: Soft wavy transition into #FDEEF1 (Soft Pastel Pink).
  - Left Column (55%):
    - Eyebrow tag: Pill badge with white background, subtle border, and text "Hi, Digital Creator 👋".
    - H1 Headline: "Master Digital Skills & Sell Ready-Made Digital Products that <span style='color:#FF2E63'>People Love</span>".
    - Subtitle: "Access 45+ video lessons, plug-and-play business templates, and instant automated delivery straight to your WhatsApp & Email." (16px #475569).
    - Dual CTA Group: Primary filled pill button [Explore Catalog →] (Background #FF2E63, text white, font-weight 600, shadow 0 10px 20px rgba(255,46,99,0.3)) + Secondary pill button [Access Member Area 🔑] (Outlined #0F172A, text #0F172A).
    - Social/Platform Icons row: 5 rounded icon squares (Google Drive, Sheets, YouTube, WhatsApp, Gmail) with caption "100% Automated by Google Workspace".
  - Right Column (45%):
    - 2.5D Tech Illustration: Realistic laptop mockup displaying an interactive code/dashboard interface, floating smartphone showing mobile store preview, ceramic coffee mug with "SH." logo, potted succulent plant, floating [</>] bracket badge, and sparkle stars.
- Metric Counters Row:
  - 4 floating white cards (#FFFFFF, radius 20px, subtle shadow):
    - Card 1: Icon box (Pink #FDEEF1) with [Users icon] + "1,200+ Active Members"
    - Card 2: Icon box (Mint #E8F8F5) with [Folder icon] + "45+ Modules & Kits"
    - Card 3: Icon box (Lavender #F3EDFD) with [Star icon] + "98% Satisfaction"
    - Card 4: Icon box (Cream #FFF8F0) with [Zap icon] + "Instant 24/7 Delivery"
- Categories Section (What We Offer):
  - Wavy background transition into #E8F8F5 (Soft Pastel Mint).
  - Section Header: Eyebrow "What We Provide ✻", H2 Title "Curated Digital Products & Academy".
  - 4 Floating Cards Grid (Equal Width, White #FFFFFF, border-radius 20px, hover: translateY(-4px)):
    - Card 1: Lavender icon box with [Video Camera] + Title "Practical E-Courses" + Subtitle "Step-by-step video tutorials from scratch" + Link [Browse Courses →] in #FF2E63.
    - Card 2: Pink icon box with [Layout Grid] + Title "Business Templates" + Subtitle "Notion OS, Sheets CRM, & Canva packs" + Link [Browse Templates →].
    - Card 3: Amber icon box with [Cloud/Code] + Title "Source Code & Web Apps" + Subtitle "Production-ready GAS & headless apps" + Link [Browse Apps →].
    - Card 4: Mint icon box with [Award/Users] + Title "Mentoring & Bundles" + Subtitle "Private Q&A group & live workshops" + Link [View Bundles →].
- Selected Products & Batch Limiter Section:
  - Canvas background #FFFDF9.
  - Section Header: Eyebrow "Active Batches", H2 Title "Featured Products & Limited Enrollment".
  - 3 Product Cards:
    - Card 1 (Active Batch): White card, image banner mockup, Red urgent pill "Batch 3: 8 Seats Left", Title "GAS Pro Web App Masterclass", Pricing ("Rp 249.000" strikethrough in gray, "Rp 99.000" in bold Navy), Feature bullets with green checkmarks, Full-width primary button [Enroll Now →] in #FF2E63.
    - Card 2 (Instant Kit): White card, image banner mockup, Green pill "Instant Download", Title "Digital Agency Notion OS", Pricing ("Rp 199.000" strikethrough, "Rp 79.000" bold), Full-width primary button [Instant Checkout →].
    - Card 3 (Sold Out / Waitlist): White card, image banner, Gray pill "Batch 2 Closed", Title "Fullstack Automation Bootcamp", Price "Rp 499.000", Badge "Quota Full", Secondary outlined button [Join Priority Waitlist ⏳] (Border #0F172A).
- Member Showcase Section (Social Proof):
  - Wavy background transition into #F3EDFD (Soft Pastel Lavender).
  - Section Header: Eyebrow "Member Showcase", H2 Title "Selected Work: Built by Our Academy Members", Subtitle "Real dashboards and apps built by students."
  - 2 Dual-Screen Showcase Cards:
    - Showcase Card 1: Mint background container with dual tilted mobile screen mockups, Title "Lawfirm CRM System", Author "by Aditya - Freelance Developer", Stat badge in dark navy "2,450+ Leads Processed", Link [View Case Study →].
    - Showcase Card 2: Soft Pink background container with dual mobile screen mockups, Title "E-Commerce Auto-Invoice", Author "by Sarah - Agency Owner", Stat badge "10x Faster Invoicing", Link [View Case Study →].
- Testimonials Section: 3 white cards with 5 golden stars, circular member photo avatar, verified buyer badge, name, profession, and testimonial quote.
- Pre-Footer High-Five Banner:
  - Full-width rounded card (radius 24px) on #FDEEF1 background with hand-drawn illustration of two hands giving a high-five, large headline "Have a digital project idea? Let's build <span style='color:#FF2E63; text-decoration: underline'>something</span> great together!", and dark pill button [Start Learning Today →] (#0F172A).
- Footer: Deep Midnight Navy #0F172A with wavy top edge. White text, logo, quick links, tech stack badges (Google Apps Script, Google Drive, Google Sheets, Gmail), and copyright notice.
- Floating WhatsApp Widget: Fixed at bottom-right, circular 56px button with WhatsApp green (#25D366) and white icon, pulsating glow effect, and speech bubble tooltip "Need help choosing a product? Chat here!".

---

### SCREEN 02: PUBLIC LANDING PAGE (MOBILE BREAKPOINT)
Single-column 375px responsive mobile view:
- Compact top announcement bar with continuous marquee text.
- Header with logo left, shopping cart badge center, and hamburger drawer icon right.
- Hero section stacked: centered headline, scaled 2.5D device illustration (320px width), stacked buttons ([Explore Catalog] full width on top of [Access Member Area]).
- Metric counters arranged in a 2x2 grid with compact 14px padding.
- Categories presented as horizontal swipeable cards with peek overflow.
- Product cards in a vertical single-column feed.
- Persistent Sticky Bottom Bar: Height 60px, white background with top shadow, containing 2 equal touch buttons: Outlined [💬 WhatsApp CS] and Solid Pink [🚀 Buy Now].

---

### SCREEN 03: INSTANT CHECKOUT MODAL
Overlay modal card (580px width) centered on a darkened backdrop (rgba(15, 23, 42, 0.6)):
- Modal Card: Pure white #FFFFFF, radius 24px, padding 32px. Top-right circular close button.
- Header: Title "Instant Checkout", Subtitle "Complete your order in 60 seconds."
- Order Summary Card: Soft gray container (#F8FAFC, radius 12px) showing product thumbnail, "GAS Pro Web App Masterclass (Batch 3)", Price "Rp 99.000", and green badge "Lifetime Access".
- Buyer Form:
  - Input: "Full Name *" [Placeholder: John Doe]
  - Input: "WhatsApp Number *" [Placeholder: 08123456789 (for instant WhatsApp access)]
  - Input: "Email Address *" [Placeholder: john@example.com (for official PDF receipt)]
- Bank Details Box: Highlight box with BCA logo, Account Number "123-456-7890 a/n EtalaseKu", copy button with feedback "Copied!", and total payment text "Total: Rp 99.000".
- File Upload Dropzone: Dashed border (#CBD5E1), cloud upload icon in pink #FF2E63, text "Click or drag & drop payment screenshot (JPG/PNG up to 5MB)". Shows upload progress bar in green when file is selected.
- Primary CTA: Full-width solid pink pill button [Submit Order & Get Instant Access →] (#FF2E63, height 48px).
- Security Note: Centered caption with lock icon "🔒 Stored safely in Google Drive. Verified in minutes."

---

### SCREEN 04: BATCH FULL / WAITLIST MODAL
Centered modal dialog (480px width) on dark backdrop:
- Modal Card: White #FFFFFF, radius 20px, padding 28px.
- Top Badge: Red pill badge "BATCH 3 FULL", Title "Join Batch 4 Priority Waitlist", Subtitle "Seats for this batch have been completely claimed. Register below to get 24-hour early access for the next batch."
- Form: Read-only field "Product: GAS Pro Web App Masterclass", inputs for Name, WhatsApp Number, and Email Address.
- Submit Button: Full-width dark navy pill button [Join Priority Waitlist ⏳] (#0F172A).
- Success Feedback: Animated checkmark with text "You're #14 on the priority list. We'll WhatsApp you as soon as seats open!"

---

### SCREEN 05: ORDER CONFIRMATION & ACCESS RECEIPT PAGE
Post-checkout success page (720px width card on #FFFDF9 canvas):
- Success Header: Large green circular checkmark icon with ripple animation, H2 "Order Successfully Placed!", Subtitle "Order ID: ORD-20261028-0842".
- Split Receipt Card (White #FFFFFF, radius 20px, shadow):
  - Left Panel (60%):
    - Status Pill: Yellow badge [PENDING ADMIN VERIFICATION] (or Green badge [VERIFIED & PAID]).
    - Details Table: Buyer Name, WhatsApp Number, Product Name, Batch Number, Total Paid, and Payment Timestamp.
    - Info Notice: "Our system is verifying your payment screenshot in Google Drive. Your classroom login and materials link are being sent automatically to your WhatsApp & Email."
  - Right Panel (40%):
    - QR Code Box: High-contrast QR code placeholder with label "Scan to Verify Authenticity".
    - Action Buttons:
      - Primary Dark Button [Open Member Classroom 🔑] (#0F172A)
      - Green Button [Confirm via WhatsApp CS 💬] (#25D366)
      - Secondary Outlined Link [Download PDF Receipt 📥]

---

### SCREEN 06: MEMBER CLASSROOM AREA (LEARNING PORTAL)
Clean, distraction-free learning app layout:
- Top Member Nav: Height 64px, White #FFFFFF, bottom border #E2E8F0. Left: Brand logo & course title "GAS Pro Web App Masterclass". Right: Member profile badge with avatar circle, "John Doe", and [Log Out] link.
- Main Video Player (65% width):
  - 16:9 Video Container: Embedded YouTube Unlisted video frame with custom play overlay, playback speed toggles (1x, 1.25x, 1.5x), and full-screen button.
  - Video Header: "Module 03: Building Responsive UI with Tailwind in GAS" (H2 20px bold), duration "18 mins", and [Mark as Completed ✓] pill button in green.
  - Tabs below player:
    - Tab 1 [Lesson Notes]: Styled markdown text with formatted code blocks, copy-code button, and summary key takeaways.
    - Tab 2 [Resource Downloads]: Card list of downloadable assets stored in Google Drive: "Module_03_Cheatsheet.pdf" [Download Button] and "Starter_Code_Template.zip" [Download Button].
    - Tab 3 [Discussion & Q&A]: Member comment input and instructor answers.
- Curriculum Drawer / Sidebar (35% width):
  - Header: "Course Curriculum", overall progress bar in pink #FF2E63 "45% Completed (5/11 Modules)".
  - Accordion Sections:
    - Section 1: Foundations (3 lessons, all with green checkmark circles).
    - Section 2: Database & Caching (3 lessons, 2 completed, 1 currently playing with pink badge [▶ Now Playing]).
    - Section 3: REST API & Forms (3 lessons, grayed out with lock icon [🔒 Locked]).
  - Sticky bottom navigation: Pill button [Next Module: Lesson 04 →].

---

### SCREEN 07: ADMIN AUTHENTICATION / LOGIN
Minimalist centered login card (420px width) on #FFFDF9 canvas:
- Brand Logo at top with label "EtalaseKu Admin & Mentor Portal".
- Card Body: White #FFFFFF, radius 20px, shadow, padding 32px.
- Form:
  - Input: "Admin Access PIN / Security Secret Token *" [••••••••] with reveal password toggle.
  - Checkbox: "Remember this device for 7 days".
- Submit Button: Full-width dark navy button [Authenticate & Enter Dashboard →] (#0F172A, height 46px).
- Footer security badge: "Protected by GAS Script Properties & Session Token".

---

### SCREEN 08: ADMIN ANALYTICS DASHBOARD
Modern SaaS administration layout with dark sidebar and light analytical canvas:
- Fixed Left Sidebar (240px width, Background #0F172A, text #94A3B8):
  - Brand logo with white text and pink accent dot.
  - Navigation links with active indicator (white text, #1E293B background, left border 3px #FF2E63):
    - [Home] Dashboard (Active)
    - [Shopping Bag] Orders & Verification (with red pill badge: 5 Pending)
    - [Book Open] Products & Curriculum
    - [Users] Leads & Waitlist (with amber pill badge: 12 New)
    - [Image] Member Showcase
    - [Star] Testimonials
    - [Settings] Site Settings
- Top Bar: Breadcrumb "Dashboard / Analytics", date range dropdown [Last 30 Days ▼], Google Sheets real-time status pill [🟢 Sheets Database Synced], and Admin avatar.
- 4 KPI Metrics Row:
  - Card 1: "Total Revenue (Month)" | "Rp 24.850.000" | Green pill badge [+18% vs last month].
  - Card 2: "Paid Orders" | "184 Transactions" | [Checkmark icon].
  - Card 3: "Active Students" | "1,248 Members" | [Users icon].
  - Card 4: "Batch 3 Quota" | "8 / 50 Remaining" | Progress bar at 84% filled in pink #FF2E63.
- Analytics Charts Row (2 Columns):
  - Left Chart (60%): Line Chart with smooth curve showing daily sales revenue in IDR, hover tooltip displaying date and revenue value, gradient fill under the line.
  - Right Chart (40%): Donut Chart displaying sales distribution by category (E-Courses 55% in Navy, Templates 30% in Pink, Bundles 15% in Mint).
- Recent Orders Quick Table: Table listing recent transactions with columns (Order ID, Date, Customer Name, WhatsApp, Product, Total, Status Pill, Quick Review Button).

---

### SCREEN 09: ADMIN TRANSACTION VERIFICATION (SPLIT REVIEW)
Split-screen verification workflow (55% receipt preview, 45% metadata and 1-click approvals):
- Left Panel (55%):
  - Image container displaying uploaded bank transfer receipt from Google Drive.
  - Floating zoom toolbar: [Zoom In (+)], [Zoom Out (-)], [Rotate], and [Open Original in Drive].
- Right Panel (45%):
  - Order Metadata Card: Order ID #ORD-1028-01, Timestamp "28 Oct 2026, 16:30 WIB", Status Pill [PENDING VERIFICATION] in yellow.
  - Customer Card: Name "Budi Santoso", WhatsApp "+628123456789" (with clickable WhatsApp link), Email "budi@gmail.com".
  - Order Details: "GAS Pro Web App Masterclass (Batch 3)", Total "Rp 99.000", Method "BCA Transfer".
  - Automation Checklist Card:
    - [✓] Automatically send PDF Invoice & QR Code via GmailApp
    - [✓] Automatically send WhatsApp welcome message & community link
    - [✓] Decrement batch seat count by 1
  - Approval Buttons:
    - Large Primary Button: Solid Emerald Green [APPROVE & SEND ACCESS 🚀] (#10B981, height 50px).
    - Secondary Outlined Button: Danger Red [REJECT / REQUEST RESUBMISSION ✕] (#EF4444).

---

### SCREEN 10: ADMIN PRODUCT & CURRICULUM MANAGEMENT
Sidebar layout with two functional tabs [Product Catalog] and [Course Builder]:
- Product Catalog Tab:
  - Search bar and "+ Add New Product" pink button.
  - Data table displaying products with columns: Thumbnail, Product Name, Category, Price, Active Batch Quota, Status (Publish/Draft toggle), and Actions (Edit, Curriculum, Delete).
- Curriculum Builder Drawer (Slide-over panel from right, 500px width):
  - Title: "Curriculum Builder: GAS Pro Web App Masterclass".
  - Drag-and-drop module list with drag handles [::]:
    - Module 01: Introduction & Architecture (3 lessons) [Edit] [Delete]
    - Module 02: Google Sheets as Database (4 lessons) [Edit] [Delete]
    - Module 03: Responsive Tailwind SPA (3 lessons) [Edit] [Delete]
  - Add Lesson Form: Input for Lesson Title, Content Type dropdown [YouTube Unlisted / PDF Drive], URL input, and [Save Lesson] button.

---

### SCREEN 11: ADMIN & CS LEADS CRM / WAITLIST PANEL
Tabbed CRM interface for sales follow-up:
- Tabs: [All Leads (48)], [Product Inquiries (36)], [Batch 4 Waitlist (12)].
- Search and status filter dropdowns (New, Followed-up, Closed, Lost).
- Leads Data Table:
  - Columns: Lead ID, Date, Name, WhatsApp, Product Interested, Type (Waitlist / Inquiry), Follow-up Status Pill, and Quick Actions.
  - Quick Action Column: Direct green button [icon: WhatsApp] "Chat on WhatsApp" which opens WhatsApp Web with a pre-filled personalized message (e.g., "Hello Budi, regarding your seat for GAS Masterclass Batch 4...").
  - Notes Modal: Popup for internal CS notes.

---

### SCREEN 12: ADMIN SITE SETTINGS & CONFIGURATION
Configuration page connected directly to tb_pengaturan_situs:
- Header: Title "Site Settings & Dynamic Controls" with Save button [Save Changes to Sheets 💾] (#FF2E63).
- Settings Cards:
  - Card 1 (Announcement Bar): Text input "Banner Promo Text" (Value: "🔥 DISKON 50% - Akses Seumur Hidup Batch 3 Terbatas!") and Active toggle [ON / OFF].
  - Card 2 (WhatsApp & Support): Input for Primary WhatsApp CS Number and Default Floating Widget Message.
  - Card 3 (Community & Batch Status): Input for Telegram/WhatsApp Community Link and Global Registration Status toggle [OPEN / CLOSED].
  - Card 4 (Payment Accounts): Textarea for bank account numbers shown during checkout.

---

## Global Design Requirements
- Fully responsive design: Desktop primary (1440px), tablet adaptation (768px), and mobile view (375px) with sticky bottom navigation.
- Skeleton loading state with soft shimmer animation for all product cards, testimonials, and data tables.
- Interactive Toast Notifications: Success (Green), Error (Red), Warning (Amber), Info (Blue) positioned at top-right.
- Empty states: Friendly 2.5D hand-drawn empty illustration + encouraging text + CTA button.
- Micro-interactions: Subtle button hover elevation (translateY(-2px)), smooth accordion expansion, and soft pulse on floating WhatsApp button.
- Accessible contrast ratio meeting WCAG AA standards (4.5:1 minimum) on all text over pastel and white backgrounds.
- The overall feel: A delightful, high-converting, playful-yet-professional digital product hub that instills trust, excites learners, and feels effortless to navigate.
```
