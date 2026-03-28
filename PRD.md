Product Requirement Document (PRD): Devbhoomi Himalayan Heritage E-Commerce Platform
1. Project Overview
The objective is to build a premium, hybrid (B2B/B2C) e-commerce ecosystem for sacred and organic products from Uttarakhand. The platform must combine the high-performance efficiency of Amazon/Flipkart with a "soul-led," heritage-focused aesthetic.1
Target Segments:
Retail (B2C): Individual buyers seeking authenticity and purity .
Wholesale (B2B): Temples, spiritual stores, and bulk distributors requiring tiered pricing and credit terms .
2. Technical Stack (Recommended: Shopify Hybrid)
Based on scalability and speed-to-market analysis, a Shopify-led architecture is prioritized for its robust global payment and B2B capabilities .
Platform: Shopify (Advanced or Plus) with SparkLayer for B2B logic.4
Frontend: Custom Liquid/Hydrogen for "Bento Grid" layouts and high-fidelity visual storytelling.6
Payments: Razorpay (Domestic UPI/Cards) and Stripe/PayPal (International) .
Logistics: Shiprocket or Delhivery (Domestic) and DHL/FedEx (Global) .
3. Visual Identity & Design Tokens
The design must evoke "Mountain Air" and "Earthy Groundedness".3
3.1 Color Palette

Token
Hex Code
Use Case
Primary (Forest)
#254B5A
Brand navigation, CTAs 3
Secondary (Misty)
#A6CBD3
Hero backgrounds, accents 10
Heritage (Rust)
#9D5F1B
Sacred category highlights 3
Background
#FDF1DB
Content containers 10
Text (Stone)
#344E95
Secondary headings/labels 10

3.2 Typography
Headings: Clean sans-serif (e.g., Manrope or Inter) for performance.11
Signature: "Himalaya Signature" (flowing script) for artisanal sections and quotes.13
4. Product Catalog Architecture
Products are categorized into three distinct pillars with specific metadata requirements .
4.1 Categories
Sacred (Devbhoomi Rituals): Incense (bambooless), Rudraksha (detailed by mukhi), Brass Idols, and Havan Samagri .
Himalayan Organic Foods: Basmati rice, A2 Bilona Ghee, Raw Honey, and high-altitude pulses (Mandua, Jhangora) .
Heritage Wellness: Purified Shilajit, Ashwagandha, and Nettle infusions .
4.2 Data Model Requirements
Traceability: Fields for "Village of Origin," "Artisan Name," and "Organic Certification ID".14
Scientific Attributes: Curcumin percentage (Turmeric), Mukhi count (Rudraksha) .
5. Core Functional Requirements
5.1 Hybrid User Experience (B2C & B2B)
Guest Checkout: Enabled for B2C to reduce abandonment.12
B2B Portal: Password-protected area with a "Quick Order Matrix" (spreadsheet-style ordering).18
Tiered Pricing: Automatic discounts applied at thresholds (e.g., 50-200kg at 10% off; 500kg+ at 25% off).19
Net Payment Terms: Approval-based credit (Net 30/60) for registered wholesalers .
5.2 Global Scalability Features
Multi-Currency: Display and checkout in 130+ currencies via Shopify Payments .
Duties/Taxes: Automated DDP (Delivered Duty Paid) calculation at checkout .
Compliance Labels: Automated printing of labels matching USDA/EU Organic standards for exports.22
6. Regulatory & Export Logic
The system must validate compliance for Uttarakhand-sourced exports.23
Mandatory Codes: Integration field for IEC (Import Export Code) and AD (Authorized Dealer) Code in the admin panel.26
Certification: Automatic attachment of Transaction Certificates (TC) and NPOP/APEDA documentation to international invoices.22
7. Implementation Roadmap (12-Week Sprint)

Phase
Focus
Timeline
I: Strategy
Requirements gathering and B2B workflow mapping 30
Weeks 1-2
II: Design
High-fidelity Figma prototypes and design tokens 32
Weeks 3-5
III: Build
Core Shopify dev, B2B tiered logic, and API integrations 33
Weeks 6-10
IV: QA/Launch
Load testing, payment success audit, and SSL deployment 30
Weeks 11-12

8. Budget & Maintenance Estimations (INR)
Development (Shopify Setup): ₹3.5 Lakhs – ₹7 Lakhs .
Annual Maintenance: ₹2.2 Lakhs (includes hosting, premium apps, and technical support) 