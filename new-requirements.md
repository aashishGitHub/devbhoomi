Here is a highly detailed, line-by-line, word-by-word project requirements document designed specifically for a junior developer/fresher to implement the requested changes seamlessly. 

***

# 📋 Project Requirements: Devbhoomi to Devtatva Website Rebrand

**Developer Instructions:** Please go through this checklist point by point. Whenever there is text in **"quotes"**, copy and paste it exactly as written. 

### 1. Global Branding & Styling Changes
*   **Brand Name:** Search the entire codebase and CMS. Replace all instances of "Devbhoomi Himalayan Heritage" with **"Devtatva"**.
*   **Global Tagline:** Update the main tagline across the site to **"From the Land of Gods to Your Home"**.
*   **Background Color:** Change the global page background color to a **"light safron"** shade.
*   **Global Imagery:** Use the new master image provided by the client (which features mountains, a river, a temple, wild honey, ghee, and a sacred janeu) as the thematic base for the website to give a feel of **"Himalayan as well as purity and divinity"**.

### 2. Homepage: Hero Section
*   **Hero Background:** Implement the new master Himalayan/divinity image as the hero section's background.
*   **Hero Copy:** Replace the existing main hero text with the following exact text: 
    *   **"From Himalayan cow ghee rooted in sacred tradition to handcrafted sacred Janeu and wild honey harvested at 3,000 meters, each product carries a traceable legacy of purity and craftsmanship."**.

### 3. Homepage: Categories Section
*   **Sacred Items Category:** 
    *   Change the sub-text/items list to: **"Janeu, Sacred puja material, Havan Samagri, cow dung"**.
    *   Change the description text to: **"Authentic ritual products sourced and crafted by artisans of devbhoomi Uttarakhand"**.
    *   Extract relevant elements from the new master Himalayan image to use as the thumbnail for this category.
*   **Heritage Wellness Category:**
    *   Rename this category strictly to: **"Herbal Care"**. Remove any other sub-categories listed here previously.

### 4. Homepage: "The Commitment" Section
*   **Heading:** Change the heading from "The Devbhoomi Commitment" to **"The Devtatva commitment"**.
*   **Body Text:** Replace the paragraph with: 
    *   **"Every product we sell carries a story — from the hands that made it to the Himalayan valley it came from. We verify traceability, certify organics, and pay artisans fairly. Our endeavor is Making a better life for the people of Uttarakhand."**.
*   **Metric Labels:** Update the text under the metrics to:
    *   **"Supporting Uttarakhand artisan families"**.
    *   **"sourced from Himalayan villages"**.

### 5. Products & Inventory (Backend/CMS & Frontend UI)
*   **Inventory UI:** Modify the product cards to dynamically show the stock as per the backend inventory. If the stock hits zero, it must display exactly as **"sold out"**.
*   **Dynamic Products Page:** Ensure that the "All Products" page is configured to fetch products dynamically from the database so it updates automatically when the client adds new items.
*   **Add/Update the following exact products, descriptions, and pricing variants:**
    *   **Janeu:** Description: **"A thread of purity and tradition"** | Variants: **"pack of 5 ₹ 501/-"** and **"pack of 12 ₹ 1101/-"**.
    *   **Ghee:** Description: **"Sacred nourishment from the Himalayas"** | Variant: **"500g for ₹ 699/-"**.
    *   **Honey:** Description: **"Nature’s sweetness in its purest form"** | Variant: **"500g for ₹ 699/-"**.
    *   **Cow Dung:** Description: **"Sacred purity for spiritual rituals"** | Variants: **"100g for ₹ 199/-"** and **"500g for ₹ 499/-"**.
    *   **Sacred Puja Samagri:** (Create this as a *new* product). Description: **"Carefully curated sacred puja samagri, thoughtfully packed for Shivarchan, Rudrabhishek, Satyanarayan Katha, Navratri Pujan, Kanya Pujan, and Namkaran Sanskar, ensuring purity and ritual completeness."**.
*   **Admin Access:** Ensure the client's admin account has full permissions to modify product rates, descriptions, and availability. 

### 6. Information Pages Content Updates
Create or update the following pages with this exact copy.

**A. Company (Our Story) Page**
*   Text to paste: 
    *   **"In the timeless embrace of the Himalayas, where nature remains pure and spirituality is a way of life, Devtatva was conceived to carry forward a legacy of authenticity and devotion."**
    *   **"Rooted in the sacred land of Devbhoomi Uttarakhand, our offerings are thoughtfully sourced to preserve their original sanctity, purity, and essence. Each product reflects a harmonious blend of ancient traditions and natural abundance, curated for those who seek more than just consumption—those who seek meaning."**
    *   **"With an unwavering commitment to quality and authenticity, Devtatva aspires to bring the divine essence of the Himalayas into modern living, creating a bridge between heritage and home."**
    *   **"Devtatva"**
    *   **"From the Land of Gods to Your Home"**
    *   **"Sacred Traditions. Himalayan Purity."**

**B. Traceability Page**
*   Text to paste:
    *   **"At Devtatva, every product carries a story of origin. From the pristine regions of Devbhoomi Uttarakhand to your home, we ensure complete transparency in sourcing and preparation."**
    *   **"Each offering is carefully traced back to its source—whether it is sacred materials used in rituals or organic produce grown in the Himalayan ecosystem—ensuring authenticity, purity, and integrity at every step."**

**C. Contact Us Page**
*   Text to paste:
    *   **"Have a question about our products, order, or sourcing? Reach out to us – we are happy to help and guide you"**
    *   **"Devtatva Wellness Pvt. Ltd."**
    *   **"Post office – Binta, Bagwalipokher, District – Almora, Uttarakhand, India"**
    *   **"Email: Devtatva@zohomail.in"**
    *   **"Phone: +91 xxxxxxx521"**
    *   **"working hours: Mondy to Saturday 10AM to 5PM"**
    *   **"“From Devtatva with care”"**
    *   **"Every message is handled with the same care and authenticity that defines Devtatva"**

**D. Return & Refund Policy Page**
*(Create this as a new page)*
*   Text to paste:
    *   **"At Devtatva, we take utmost care to deliver products that reflect purity, authenticity, and quality. Due to the sacred and consumable nature of our products, returns are handled with specific guidelines."**
    *   **"Returns"**
        *   **"Returns are accepted only if the product is damaged, defective, or incorrect at the time of delivery."**
        *   **"Customers must raise a request within 48 hours of delivery with clear images."**
    *   **"Non-Returnable Items"**
        *   **"Sacred items (e.g., Janeu, Rudraksha, Puja products)"**
        *   **"Consumables (e.g., honey, ghee, herbs)"**
        *   **"Opened or used products"**
    *   **"Refunds"**
        *   **"Once approved, refunds will be processed within 5–7 business days."**
        *   **"Refunds will be credited to the original payment method."**
    *   **"Replacement"**
        *   **"Eligible products may be replaced instead of refunded, based on availability."**

### 7. Footer Updates
*   **Branding:** Change the footer logo/text from "Devbhoomi Himalayan Heritage" to:
    *   **"Devtatva"**.
    *   **"From the Land of Gods to Your Home"**.
*   **Contact Info:** Update the address to: **"Ranikhet, District Almora, Uttarakhand, India"**. Update the email to: **"Devtatva@gmail.com"**. *(Note: Use the Zoho email for the Contact page, but this Gmail specifically for the footer as requested).*
*   **Social Icons:** Locate the Instagram, Facebook, and YouTube icons in the footer and remove their URL links/hrefs so they are unclickable for now.

### 8. Checkout & Payments
*   **UPI ID:** Navigate to the payment gateway configuration. Update the destination UPI ID to exactly: **`Santosh.joshi13@axisbank`**.

***
**Note for the Developer:** 
The client has asked: *"Is it possible to allow users to create their account so that they know their history of purchase, etc? how much efforts it will take?"*.
**Action:** Do not implement user authentication yet. Please analyze the codebase and provide a time/effort estimation for building a User Login, Registration, and Order History dashboard so we can quote the client.