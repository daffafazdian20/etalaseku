# 📐 WIREFRAME PROMPT — GOOGLE STITCH AI
## EtalaseKu Digital Hub & Academy

Dokumen ini berisi prompt wireframe grayscale lengkap (12 layar) yang siap disalin dan ditempel ke **Google Stitch AI** atau alat prototyping lainnya.

---

```text
Create detailed wireframes for EtalaseKu Digital Hub & Academy.
Use grayscale/black-and-white wireframe style only — no colors, no images,
just layout structure, placeholder boxes, labels, and navigation flow.

## Application Context
EtalaseKu Digital Hub & Academy is an all-in-one digital product marketplace, e-learning academy, and sales automation platform powered by Google Workspace (Google Apps Script, Google Sheets, and Google Drive). The web app features a high-converting public landing page inspired by modern floating cards and wavy pastel sections, an instant checkout and waitlist modal, a passwordless member learning classroom, and an admin management dashboard with revenue analytics and 1-click order verification.
Has 3 main sections: (1) Public Storefront & Conversion Funnel, (2) Member Learning Portal, and (3) Admin Management & CRM Operations.

## Wireframe Pages Required

--- PAGE W-01: PUBLIC LANDING PAGE (DESKTOP) ---
Layout: Full-width page with sticky top announcement bar, fixed navbar, multi-section scroll, and dark wavy footer.
- [Announcement Bar]: Sticky top slim bar with centered text label "🔥 PROMO: 50% OFF - Lifetime Access for Batch 3 (Limited Slots)" and [icon: close].
- [Top Navbar]: Brand logo placeholder [SH. EtalaseKu Hub], horizontal nav links (Home, Categories, Selected Work, Curriculum, Testimonials), and right-side primary button [Access Classroom 🔑].
- [Hero Section]:
  - Left Column (55%):
    - Eyebrow tag: "Hi, Digital Creator 👋"
    - H1 Headline: "Master Digital Skills & Sell Ready-Made Digital Products"
    - Subtitle: "Access 45+ video modules, plug-and-play business templates, and instant automated delivery straight to your WhatsApp & Email."
    - Button Group: Primary filled button [Explore Catalog →] + Secondary outlined button [Access Member Area 🔑]
    - Social/Platform Icons row: 5 square icon placeholders [icon: Drive] [icon: Sheets] [icon: YouTube] [icon: WhatsApp] [icon: Gmail]
  - Right Column (45%):
    - Hero Illustration Placeholder: Large device frame mockup (Laptop displaying code/dashboard with [X] placeholder, tilted smartphone mockup with [X], coffee mug, succulent plant, sparkle stars, and [</>] badge).
- [Metric Counters Row]: 4 horizontal cards below hero:
  - Card 1: "1,200+ Active Members" [icon: users]
  - Card 2: "45+ Modules & Templates" [icon: folder]
  - Card 3: "98% Satisfaction Rating" [icon: star]
  - Card 4: "Instant 24/7 Delivery" [icon: zap]
- [Section Divider 1]: Wavy curve divider graphic placeholder.
- [Category Grid (What We Offer)]:
  - Section Header: Eyebrow "Categories", Title "Curated Digital Products & Academy", Subtitle "Choose from self-paced courses, templates, and full system blueprints."
  - 4 Floating Cards Grid (Equal Width, rounded borders):
    - Card 1: [icon: video] "Practical E-Courses" (Subtitle: Step-by-step video lessons) + Link [Browse Courses →]
    - Card 2: [icon: layout] "Business Templates" (Subtitle: Notion, Sheets & Canva kits) + Link [Browse Templates →]
    - Card 3: [icon: code] "Source Code & Web Apps" (Subtitle: Production-ready GAS & web apps) + Link [Browse Apps →]
    - Card 4: [icon: award] "Mentoring & Bundles" (Subtitle: Private Q&A & community access) + Link [View Bundles →]
- [Section Divider 2]: Wavy curve divider graphic placeholder.
- [Selected Products & Batch Limiter]:
  - Section Header: Title "Featured Products & Active Batches", Subtitle "Enroll now before the weekly quota closes."
  - 3 Product Cards:
    - Card 1 (Active Batch): Product image box with [X], Badge "Batch 3 - 8 Seats Left", Title "GAS Pro Web App Masterclass", Price tags ("Rp 249.000" strikethrough, "Rp 99.000" bold), Bullet features list, Primary filled button [Buy Now / Enroll →]
    - Card 2 (Active Batch): Product image box with [X], Badge "Instant Download", Title "Digital Agency Notion OS", Price tags ("Rp 199.000" strikethrough, "Rp 79.000" bold), Bullet features list, Primary filled button [Instant Checkout →]
    - Card 3 (Sold-Out Batch): Product image box with [X], Badge "Batch 2 Full", Title "Fullstack Automation Bootcamp", Price tag "Rp 499.000", Inactive badge "Quota Reached", Outlined secondary button [Join Waitlist ⏳]
- [Section Divider 3]: Wavy curve divider graphic placeholder.
- [Member Showcase & Social Proof]:
  - Section Header: Title "Selected Work: Built by Our Academy Members"
  - 2 Dual-Screen Showcase Cards:
    - Showcase Card 1: Dual mobile device mockups [X], Project title "Lawfirm CRM System", Member name "by Aditya - Freelance Developer", Stat badge "2,450+ Leads Processed", Link [View Case Study →]
    - Showcase Card 2: Dual mobile device mockups [X], Project title "E-Commerce Auto-Invoice", Member name "by Sarah - Agency Owner", Stat badge "10x Faster Invoicing", Link [View Case Study →]
- [Testimonials Grid]: 3 review cards with 5-star rating placeholder, avatar circle [X], member name, job role, and quote text.
- [Pre-Footer High-Five Banner]: Full-width card with hand-drawn high-five illustration placeholder [X], headline "Have a digital project idea? Let's build it together!", and dark button [Start Learning Today →].
- [Footer (Dark)]: Brand description, Quick Links column, Categories column, Tech Stack badges (GAS, Drive, Sheets, Gmail), Contact info, and Copyright 2026.
- [Floating Widget]: Fixed circle button at bottom-right [icon: WhatsApp] "Chat with CS".

--- PAGE W-02: PUBLIC LANDING PAGE (MOBILE BREAKPOINT) ---
Layout: Single-column 375px vertical mobile viewport.
- [Announcement Bar]: Compact scrolling text bar at top.
- [Mobile Navbar]: Logo left, [icon: menu] hamburger drawer toggle right.
- [Hero Section (Stacked)]:
  - Centered text: Greeting, H1 headline, and subtitle.
  - Device Illustration placeholder [X] scaled to fit 320px width.
  - Vertical stacked CTA buttons: Full-width [Explore Catalog →] on top of [Access Member Area 🔑].
- [Metric Counters]: 2x2 grid of compact stat tiles.
- [Categories]: Horizontal scrollable carousel / cards stacked vertically.
- [Product Cards]: 1-column vertical feed with large tap-friendly buttons.
- [Showcase Cards]: Single mockup per card with stats pill below.
- [Sticky Mobile Bottom Bar]: Fixed at bottom viewport with 2 actions: [💬 WhatsApp CS] and [🚀 Buy Now].

--- PAGE W-03: INSTANT CHECKOUT MODAL ---
Layout: Centered modal card (600px max-width) with dark background overlay and [X] close button at top-right.
- [Header]: Modal Title "Instant Checkout" + Subtitle "Complete your order in 60 seconds."
- [Product Order Summary Box]:
  - Product thumbnail box [X], Product title "GAS Pro Web App Masterclass (Batch 3)", Price tag "Rp 99.000", Lifetime Access badge.
- [Form Section: Buyer Contact Information]:
  - Input field with label: "Full Name *" [Placeholder: John Doe]
  - Input field with label: "WhatsApp Number *" [Placeholder: 08123456789 (for instant access link)]
  - Input field with label: "Email Address *" [Placeholder: john@example.com (for PDF invoice)]
- [Form Section: Payment Method]:
  - Radio options: (•) BCA Transfer - 1234567890 a/n EtalaseKu | ( ) Mandiri Transfer | ( ) QRIS Instant
  - Total payment highlight box: "Total to Pay: Rp 99.000"
- [Form Section: Proof of Transfer Upload]:
  - Dashed border dropzone box: [icon: upload] "Drag & drop payment receipt screenshot or Click to Browse" (Supports JPG, PNG up to 5MB).
- [Submit Action]: Large full-width primary button [Submit Order & Get Instant Access →].
- [Security Note]: Small text below button "🔒 Protected by Google Workspace. Verified within minutes."

--- PAGE W-04: BATCH FULL / WAITLIST MODAL ---
Layout: Centered modal dialog (480px width) with dark backdrop.
- [Header]: Badge "BATCH FULL", Title "Join Batch 4 Priority Waitlist", Subtitle "The current batch has reached maximum capacity. Register to get priority enrollment."
- [Form Fields]:
  - Product Name (Read-only field): "GAS Pro Web App Masterclass"
  - Input field: "Full Name *"
  - Input field: "WhatsApp Number *"
  - Input field: "Email Address *"
  - Dropdown: "Expected Start Time" (Next Week / Next Month)
- [Action Button]: Full-width primary button [Join Priority Waitlist ⏳].
- [Footer Note]: "We will send an invite link directly to your WhatsApp as soon as seats open."

--- PAGE W-05: ORDER CONFIRMATION & ACCESS RECEIPT PAGE ---
Layout: Centered card layout (700px width) on light canvas with print/download button.
- [Top Status Banner]: Large checkmark circle [icon: check], Heading "Order Successfully Placed!", Subtitle "Order ID: ORD-20261028-0842".
- [Digital Receipt Box (Split Layout)]:
  - Left Panel (60%):
    - Table of items: Product Name, Batch Number, Price, Payment Method, Buyer WhatsApp & Email.
    - Status Pill: [PENDING VERIFICATION] (or [VERIFIED / PAID]).
    - Instructions Box: "Admin is verifying your payment. Your login and materials will be sent automatically to your WhatsApp & Email."
  - Right Panel (40%):
    - QR Code Verification Placeholder: Square box [QR CODE: Scan to Verify Authenticity].
    - Direct Action Buttons:
      - Primary button [Open Member Classroom 🔑]
      - Secondary outlined button [Confirm via WhatsApp CS 💬]
      - Tertiary link button [Download PDF Receipt 📥]

--- PAGE W-06: MEMBER CLASSROOM AREA (LEARNING PORTAL) ---
Layout: App layout with top navigation bar and 2-column video player + curriculum drawer.
- [Top Member Bar]: Brand Logo, Course Title "GAS Pro Web App Masterclass", Member Profile Pill [ID: MEM-0842 / John Doe], and [Log Out] link.
- [Main Player Column (65%)]:
  - Video Player Frame (16:9 aspect ratio): Black frame with YouTube Unlisted player controls placeholder, play button [▶], progress bar, and full-screen icon.
  - Video Title: "Module 03: Building Responsive UI with Tailwind in GAS"
  - Lesson Metadata: Duration "18 mins" | Status [Completed ✓]
  - Tabbed Content Box below video:
    - Tab 1 [Lesson Notes]: Text paragraph summary and code snippet placeholder block.
    - Tab 2 [Resource Downloads]: Download list items with [icon: file-pdf] "Lesson 3 Cheatsheet.pdf" [Download Button] and [icon: drive] "Starter Code Repo" [Open Drive Button].
    - Tab 3 [Discussion & Q&A]: Member comment input field and list of answered questions.
- [Curriculum Sidebar Column (35%)]:
  - Sidebar Header: "Course Curriculum", Progress bar "45% Completed (5/11 Modules)".
  - Module Accordion List:
    - Section 1: Introduction to GAS Web Apps (3 lessons - all marked [✓])
    - Section 2: Sheets as Database & Caching (3 lessons - 2 marked [✓], 1 [▶ Active])
    - Section 3: REST API & Form Automation (3 lessons - locked [🔒])
    - Section 4: Final Project Deployment (2 lessons - locked [🔒])
  - Next Lesson Floating Bar at bottom: Button [Next Module: Lesson 04 →].

--- PAGE W-07: ADMIN AUTHENTICATION / LOGIN ---
Layout: Centered login card (400px width) on minimal canvas.
- [Brand Header]: Logo [SH. EtalaseKu Hub] + Label "Admin & Mentor Portal".
- [Security Input Box]:
  - Input field: "Admin Access PIN / Security Secret Token *" [••••••••]
  - Remember Session checkbox: [ ] Keep me logged in for 7 days
- [Submit Button]: Full-width dark button [Authenticate & Enter Dashboard →].
- [Helper Text]: "Access restricted to authorized store owners and mentoring staff."

--- PAGE W-08: ADMIN ANALYTICS DASHBOARD ---
Layout: Fixed left sidebar (240px width) + top header bar + multi-column dashboard body.
- [Left Sidebar]:
  - Logo [EtalaseKu Admin]
  - Navigation menu with count badges:
    - [icon: home] Dashboard (Active)
    - [icon: shopping-bag] Orders & Verification [Badge: 5 Pending]
    - [icon: book] Products & Curriculum
    - [icon: users] Leads & Waitlist [Badge: 12 New]
    - [icon: image] Member Showcase
    - [icon: star] Testimonials
    - [icon: settings] Site Settings
- [Top Bar]: Breadcrumbs "Admin / Dashboard", Date Range Selector dropdown [Last 30 Days ▼], Google Sheets Sync Status indicator [🟢 Sheets Connected], and Profile avatar circle.
- [4 KPI Summary Cards]:
  - Card 1: "Total Revenue (Month)" | "Rp 24.850.000" | [↑ +18% vs last month]
  - Card 2: "Paid Transactions" | "184 Orders" | [icon: check-circle]
  - Card 3: "Active Members" | "1,248 Users" | [icon: users]
  - Card 4: "Batch 3 Seats Left" | "8 / 50 Remaining" | [ProgressBar: 84%]
- [Charts Section (2 Columns)]:
  - Left Chart (60%): Box labeled "[CHART: Daily Revenue Trend Line Chart - Axis: Date vs IDR Revenue]".
  - Right Chart (40%): Box labeled "[CHART: Best-Selling Products Donut Chart - E-Course 55%, Templates 30%, Bundles 15%]".
- [Recent Orders Table (Quick Verification Table)]:
  - Table Header: Columns (Order ID, Date, Buyer Name, WhatsApp, Product, Total, Status, Action).
  - Row 1: ORD-1028-01 | 28 Oct 16:30 | Budi Santoso | 0812xxx | GAS Masterclass | Rp 99.000 | [Pill: PENDING] | [Quick Review Button]
  - Row 2: ORD-1028-02 | 28 Oct 15:10 | Anita Wijaya | 0819xxx | Notion Agency OS | Rp 79.000 | [Pill: PAID] | [View Receipt]
  - Footer: Link [View All Transactions →].

--- PAGE W-09: ADMIN TRANSACTION VERIFICATION (SPLIT REVIEW) ---
Layout: 2-column split review layout (55% receipt preview, 45% metadata & approval controls).
- [Top Bar]: Back link "← Back to Orders", Title "Review Order #ORD-1028-01", Status pill [PENDING REVIEW].
- [Left Panel (55%): Payment Receipt Preview]:
  - Large image container showing uploaded transfer receipt with zoom controls [icon: zoom-in] [icon: zoom-out] [icon: rotate].
  - Metadata overlay: "File: BUKTI_ORD-1028-01_Budi.jpg (Stored in Google Drive / Bukti_Transfer)".
- [Right Panel (45%): Order Details & Approval Actions]:
  - Card 1: Buyer Information (Name: Budi Santoso, WhatsApp: +628123456789, Email: budi@gmail.com).
  - Card 2: Order Information (Product: GAS Pro Web App Masterclass, Batch: 3, Total: Rp 99.000, Bank: BCA Transfer).
  - Card 3: Automated Actions Checklist:
    - [✓] Send instant access email with PDF invoice via GmailApp
    - [✓] Send instant WhatsApp welcome message & group link
    - [✓] Decrement batch seat counter (-1 seat)
  - Action Button Group:
    - Primary Full Dark Button: [APPROVE & SEND ACCESS 🚀]
    - Secondary Outlined Button: [REJECT / REQUEST RESUBMIT ✕] (Opens reason modal)

--- PAGE W-10: ADMIN PRODUCT & CURRICULUM MANAGEMENT ---
Layout: Sidebar + content area with tabs for "Products List" and "Course Builder".
- [Top Actions]: Search input, Category filter dropdown, and "+ Add New Product" button.
- [Product Catalog Table]:
  - Columns: Image, Product Name, Category, Normal Price, Promo Price, Batch Quota, Status (Publish/Draft), Actions (Edit, Modules, Delete).
- [Course Module Builder Drawer (Slide-Over Panel)]:
  - Panel Title: "Curriculum Builder: GAS Pro Web App Masterclass"
  - Reorderable Module List (with drag handle [::]):
    - Module 1: Intro & Setup [3 Lessons] [Edit] [Delete]
    - Module 2: Database Schema [4 Lessons] [Edit] [Delete]
    - Module 3: Frontend SPA [3 Lessons] [Edit] [Delete]
  - Form: "+ Add New Lesson" (Input: Lesson Title, Content Type dropdown [YouTube Unlisted / PDF Drive], URL input, Duration input) + Button [Save Lesson].

--- PAGE W-11: ADMIN & CS LEADS CRM / WAITLIST PANEL ---
Layout: Sidebar + content area with filter tabs: [All Leads (48)], [Product Inquiries (36)], [Batch Waitlist (12)].
- [Filter Bar]: Search by Name/WhatsApp, Product dropdown, Status dropdown (New, Followed-up, Closed, Lost).
- [Leads Table]:
  - Columns: Lead ID, Date, Name, WhatsApp Number, Inquiry/Product, Type (Waitlist / Question), Status Pill, Quick Actions.
  - Quick Actions column:
    - Green button: [icon: WhatsApp] "Chat on WhatsApp" (Auto-generates pre-filled text based on lead topic).
    - Status dropdown: Change status to Followed-up or Closed.
    - Notes button: Opens CS internal notes modal.

--- PAGE W-12: ADMIN SITE SETTINGS & CONFIGURATION ---
Layout: Sidebar + 2-column form settings page linked directly to tb_pengaturan_situs.
- [Header]: Title "Site Settings & Dynamic Controls", Save button [Save Changes to Google Sheets 💾].
- [Form Section 1: Promo & Announcement Bar]:
  - Textarea: "Top Announcement Bar Text" [🔥 DISKON 50% - Akses Seumur Hidup Batch 3 Terbatas!]
  - Toggle switch: Announcement Bar Active [ON / OFF]
- [Form Section 2: Contact & Social Links]:
  - Input field: "Primary WhatsApp CS Number" [628123456789]
  - Input field: "Default Floating WhatsApp Message" [Halo Admin EtalaseKu, saya ingin tanya mengenai...]
  - Input field: "Community Telegram / WhatsApp Group Link" [https://t.me/...]
- [Form Section 3: Batch Registration & Payment Accounts]:
  - Toggle switch: "Global Registration Status" [OPEN / CLOSED]
  - Textarea: "Bank Account Details (Displayed at Checkout)" [BCA: 1234567890 a/n EtalaseKu | Mandiri: 9876543210]

## Wireframe Style Notes
- Use only grayscale: white, light gray (#EEEEEE), medium gray (#AAAAAA), dark gray (#333333), black.
- Text placeholders: Use actual representative labels, not "Lorem Ipsum".
- Buttons: Show shape and label clearly — primary buttons filled dark, secondary outlined.
- Images/covers: Show as plain box with X through it (standard wireframe placeholder).
- Charts: Show as empty chart frames with axis labels and chart type label inside.
- Icons: Show as simple labeled squares [icon: name].
- Number badges: Show on nav items where relevant (pending counts, notifications).
- Show mobile breakpoint for at least the HOME page as additional frame (PAGE W-02).
- Add flow arrows between key pages:
  - Flow 1: W-01 (Landing Page) → Click [Buy Now] → W-03 (Checkout Modal) → Submit Proof → W-05 (Receipt Page) → Click [Access Classroom] → W-06 (Member Learning Portal).
  - Flow 2: W-01 (Sold-Out Batch) → Click [Join Waitlist] → W-04 (Waitlist Modal) → Record in W-11 (Leads CRM).
  - Flow 3: W-07 (Admin Login) → W-08 (Dashboard) → Click Pending Order → W-09 (Split Review) → [Approve] → Triggers Automated Access Email/WhatsApp → W-05 / W-06.
```
