/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  TEMPORARY MOCK DATA — Replace when Go backend is ready             ║
 * ║                                                                      ║
 * ║  To switch to the real API:                                          ║
 * ║    1. Remove NEXT_PUBLIC_USE_MOCK from your .env.local               ║
 * ║    2. Set NEXT_PUBLIC_API_URL=https://api.devbhoomi.com              ║
 * ║    3. The productService (src/lib/products-data.ts) auto-switches    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Images use picsum.photos with deterministic seeds — swap with real
 * S3/CDN URLs (cdn.devbhoomi.com/...) when uploading actual product shots.
 */

import type { Product } from "@/types/product";

const B2B_TIERS = [
    { min_qty: 50, max_qty: 200, discount_pct: 10 },
    { min_qty: 201, max_qty: 500, discount_pct: 18 },
    { min_qty: 501, discount_pct: 25 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SACRED — Ritual & Spiritual Products
// ─────────────────────────────────────────────────────────────────────────────
const SACRED_PRODUCTS: Product[] = [
    {
        id: "prod_rudraksha_5mukhi_001",
        name: "5 Mukhi Rudraksha Mala (108 Beads)",
        slug: "5-mukhi-rudraksha-mala",
        category: "sacred",
        subcategory: "rudraksha",
        description:
            "Strung with 108 authentic 5-face Rudraksha beads hand-selected in Rishikesh, this mala is traditionally associated with Lord Shiva and believed to bring peace, clarity, and protection. Each bead is sourced from mature Elaeocarpus ganitrus trees growing at altitudes above 2,000 m and individually inspected by our artisans. Comes in a handwoven jute pouch with a certificate of authenticity.",
        price: { inr: 1800, usd: 21.60 },
        b2b_pricing: B2B_TIERS,
        traceability: {
            village_of_origin: "Rishikesh, Uttarakhand",
            artisan_name: "Ramesh Joshi",
            certification_id: "NPOP-UK-2024-0892",
        },
        scientific_attributes: {
            mukhi_count: 5,
            bead_count: 108,
            avg_bead_diameter_mm: 8,
            species: "Elaeocarpus ganitrus",
            altitude_m: 2100,
        },
        images: [
            "https://picsum.photos/seed/rudraksha-mala/600/400",
            "https://picsum.photos/seed/rudraksha-close/600/400",
        ],
        seo: {
            title: "5 Mukhi Rudraksha Mala (108 Beads) — Authentic from Rishikesh",
            description:
                "Genuine 5-face Rudraksha mala with 108 beads, sourced from Rishikesh artisans. NPOP certified. Free shipping above ₹999.",
            keywords: ["rudraksha", "5 mukhi", "mala", "108 beads", "rishikesh", "sacred"],
        },
        inventory: { retail: 240, wholesale: 4800 },
        moq: { wholesale: 50 },
        weight_kg: 0.065,
        dimensions_cm: { l: 45, w: 2, h: 2 },
        status: "active",
        created_at: "2026-01-10T08:00:00Z",
        updated_at: "2026-03-01T10:00:00Z",
    },
    {
        id: "prod_brass_nataraj_001",
        name: "Brass Nataraj Idol — Hand-Cast (6 inch)",
        slug: "brass-nataraj-idol-6-inch",
        category: "sacred",
        subcategory: "ritual-artifacts",
        description:
            "A stunning 6-inch Nataraj idol hand-cast using the ancient lost-wax (cire perdue) method by master craftsmen in Almora, Uttarakhand. Lord Shiva in his cosmic dance form represents the cycle of creation and destruction. The idol is finished with an antique brass patina and mounted on a lotus base. Each piece is unique — no two are identical.",
        price: { inr: 2800, usd: 33.60 },
        b2b_pricing: B2B_TIERS,
        traceability: {
            village_of_origin: "Almora, Uttarakhand",
            artisan_name: "Gopal Rana",
            certification_id: "AHDI-UK-2025-0113",
        },
        scientific_attributes: {
            material: "85% copper brass alloy",
            casting_method: "Lost-wax (cire perdue)",
            finish: "Antique brass patina",
            height_inches: 6,
        },
        images: [
            "https://picsum.photos/seed/nataraj-idol/600/400",
            "https://picsum.photos/seed/nataraj-base/600/400",
        ],
        seo: {
            title: "Brass Nataraj Idol 6 inch — Hand-Cast by Almora Artisans",
            description:
                "Authentic hand-cast brass Nataraj idol from Almora, Uttarakhand. Lost-wax casting method, antique patina finish.",
            keywords: ["nataraj", "brass idol", "shiva", "dancing shiva", "almora", "handcast"],
        },
        inventory: { retail: 85, wholesale: 500 },
        moq: { wholesale: 10 },
        weight_kg: 0.48,
        dimensions_cm: { l: 12, w: 8, h: 15 },
        status: "active",
        created_at: "2026-01-12T08:00:00Z",
        updated_at: "2026-03-05T10:00:00Z",
    },
    {
        id: "prod_dhoop_lotus_001",
        name: "Bambooless Dhoop Cones — Lotus & Camphor",
        slug: "bambooless-dhoop-cones-lotus-camphor",
        category: "sacred",
        subcategory: "incense-fragrance",
        description:
            "Hand-rolled dhoop cones made entirely from natural ingredients — recycled temple flower offerings (mainly lotus and marigold), camphor, and Himalayan resins. Completely bamboo-free and plastic-free. Each cone burns cleanly for 20–25 minutes, releasing a rich, grounding fragrance traditionally used for pujas and meditation. Box of 20 cones.",
        price: { inr: 220, usd: 2.65 },
        b2b_pricing: [
            { min_qty: 100, max_qty: 500, discount_pct: 12 },
            { min_qty: 501, discount_pct: 20 },
        ],
        traceability: {
            village_of_origin: "Haridwar, Uttarakhand",
            artisan_name: "Savitri Devi (SHG)",
            certification_id: "NPOP-UK-2025-0241",
        },
        scientific_attributes: {
            cone_count: 20,
            burn_time_min: "20–25",
            key_ingredients: "Lotus, marigold, camphor, guggal resin",
            bamboo_free: true,
            synthetic_fragrance: false,
        },
        images: [
            "https://picsum.photos/seed/dhoop-cones/600/400",
            "https://picsum.photos/seed/dhoop-smoke/600/400",
        ],
        seo: {
            title: "Bambooless Dhoop Cones — Lotus & Camphor | Devbhoomi",
            description:
                "100% natural bamboo-free dhoop cones from Haridwar. Made from recycled temple flowers, camphor, and Himalayan resins. Box of 20.",
            keywords: ["dhoop cones", "bamboo free", "natural incense", "lotus camphor", "haridwar"],
        },
        inventory: { retail: 620, wholesale: 12000 },
        moq: { wholesale: 100 },
        weight_kg: 0.08,
        dimensions_cm: { l: 8, w: 6, h: 4 },
        status: "active",
        created_at: "2026-01-20T08:00:00Z",
        updated_at: "2026-02-28T10:00:00Z",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOODS — Organic Himalayan Foods
// ─────────────────────────────────────────────────────────────────────────────
const FOODS_PRODUCTS: Product[] = [
    {
        id: "prod_honey_wild_001",
        name: "Wild Raw Himalayan Honey (500g)",
        slug: "wild-raw-himalayan-honey-500g",
        category: "foods",
        subcategory: "wild-herbs-honey",
        description:
            "Harvested by traditional honey hunters from wild cliff hives at 2,500–3,000 m altitude in the Kumaon Himalayas. This raw, unfiltered honey retains all natural enzymes, pollen, and antioxidants. Cold-extracted and never heated above 40°C. Darker and richer than conventional honey with a distinctive floral aftertaste. NPOP organic certified.",
        price: { inr: 850, usd: 10.20 },
        b2b_pricing: B2B_TIERS,
        traceability: {
            village_of_origin: "Munsiyari, Uttarakhand",
            artisan_name: "Bhim Singh Rawat",
            certification_id: "NPOP-UK-2024-1102",
        },
        scientific_attributes: {
            altitude_m: 2700,
            extraction_method: "Cold extraction, never heated above 40°C",
            moisture_pct: 18.2,
            HMF_ppm: "<10",
            diastase_activity_DN: ">8",
            colour: "Dark amber",
        },
        images: [
            "https://picsum.photos/seed/himalayan-honey/600/400",
            "https://picsum.photos/seed/honey-jar/600/400",
        ],
        seo: {
            title: "Wild Raw Himalayan Honey 500g — NPOP Organic | Devbhoomi",
            description:
                "Unfiltered wild honey from 2,700 m altitude in Munsiyari. Cold-extracted, NPOP organic certified. Rich in enzymes and antioxidants.",
            keywords: ["himalayan honey", "raw honey", "wild honey", "organic honey", "munsiyari"],
        },
        inventory: { retail: 342, wholesale: 6000 },
        moq: { wholesale: 50 },
        weight_kg: 0.65,
        dimensions_cm: { l: 9, w: 9, h: 13 },
        status: "active",
        created_at: "2026-01-08T08:00:00Z",
        updated_at: "2026-03-10T10:00:00Z",
    },
    {
        id: "prod_ghee_a2bilona_001",
        name: "A2 Bilona Ghee — Badri Cow (500ml)",
        slug: "a2-bilona-ghee-500ml",
        category: "foods",
        subcategory: "oils-ghee",
        description:
            "Made using the ancient bilona (hand-churned) method from the A2 milk of Badri cows — a native Himalayan breed that grazes freely on alpine meadows above 1,800 m. The milk is first cultured into curd overnight, then hand-churned to extract white butter, which is slowly simmered in clay pots over wood fire. Rich in butyric acid, CLAs, and fat-soluble vitamins. Shelf stable for 12 months.",
        price: { inr: 1450, usd: 17.40 },
        b2b_pricing: B2B_TIERS,
        traceability: {
            village_of_origin: "Chamoli, Uttarakhand",
            artisan_name: "Gaura Devi (Women's Dairy SHG)",
            certification_id: "NPOP-UK-2024-0879",
        },
        scientific_attributes: {
            cow_breed: "Badri (native Himalayan A2)",
            process: "Traditional bilona hand-churned",
            fat_pct: 99.7,
            butyric_acid_pct: 3.8,
            colour: "Pale golden, granular texture",
            shelf_life_months: 12,
        },
        images: [
            "https://picsum.photos/seed/a2-ghee/600/400",
            "https://picsum.photos/seed/bilona-process/600/400",
        ],
        seo: {
            title: "A2 Bilona Ghee 500ml — Badri Cow, Hand-Churned | Devbhoomi",
            description:
                "Traditional bilona ghee from Badri cows in Chamoli, Uttarakhand. Hand-churned, NPOP organic certified. Rich in A2 protein and butyric acid.",
            keywords: ["a2 ghee", "bilona ghee", "badri cow", "himalayan ghee", "organic ghee", "chamoli"],
        },
        inventory: { retail: 195, wholesale: 2500 },
        moq: { wholesale: 24 },
        weight_kg: 0.58,
        dimensions_cm: { l: 10, w: 10, h: 12 },
        status: "active",
        created_at: "2026-01-15T08:00:00Z",
        updated_at: "2026-03-08T10:00:00Z",
    },
    {
        id: "prod_mandua_flour_001",
        name: "Mandua (Finger Millet) Flour — Stone-Ground (1 kg)",
        slug: "mandua-finger-millet-flour-1kg",
        category: "foods",
        subcategory: "grains-pulses",
        description:
            "Mandua (Eleusine coracana) is a traditional Himalayan millet cultivated at high altitudes without chemical inputs. Stone-ground on traditional water-powered chakki mills in Lansdowne, retaining the bran and germ for full nutritional value. Naturally gluten-free, high in calcium and iron, with a deep earthy flavour. Used to make traditional rotis, porridge, and laddoos.",
        price: { inr: 180, usd: 2.15 },
        b2b_pricing: [
            { min_qty: 100, max_qty: 500, discount_pct: 10 },
            { min_qty: 501, discount_pct: 18 },
        ],
        traceability: {
            village_of_origin: "Lansdowne, Pauri Garhwal, Uttarakhand",
            artisan_name: "Sohan Lal Farmers Collective",
            certification_id: "NPOP-UK-2024-1388",
        },
        scientific_attributes: {
            species: "Eleusine coracana",
            calcium_per_100g_mg: 344,
            iron_per_100g_mg: 3.9,
            protein_pct: 7.3,
            gluten_free: true,
            milling_method: "Stone-ground (chakki)",
        },
        images: [
            "https://picsum.photos/seed/mandua-flour/600/400",
            "https://picsum.photos/seed/millet-grain/600/400",
        ],
        seo: {
            title: "Mandua Finger Millet Flour 1kg — Stone Ground, Gluten-Free | Devbhoomi",
            description:
                "Traditional Himalayan Mandua flour, stone-ground in Lansdowne. Gluten-free, NPOP organic. High in calcium and iron.",
            keywords: ["mandua", "finger millet flour", "ragi", "gluten free", "himalayan millet", "organic"],
        },
        inventory: { retail: 540, wholesale: 10000 },
        moq: { wholesale: 100 },
        weight_kg: 1.05,
        dimensions_cm: { l: 15, w: 10, h: 22 },
        status: "active",
        created_at: "2026-02-01T08:00:00Z",
        updated_at: "2026-03-12T10:00:00Z",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// WELLNESS — Heritage Himalayan Wellness
// ─────────────────────────────────────────────────────────────────────────────
const WELLNESS_PRODUCTS: Product[] = [
    {
        id: "prod_shilajit_resin_001",
        name: "Purified Shilajit Resin — Grade A (10g)",
        slug: "purified-shilajit-resin-10g",
        category: "wellness",
        subcategory: "traditional-supplements",
        description:
            "Harvested from rocky outcrops at 4,000–5,000 m altitude in the Shilajit-rich belts of Uttarkashi, this Grade-A Shilajit resin is purified through traditional sun-drying and water-purification methods. Lab-tested for heavy metals (below ICMR limits) and authenticated for fulvic acid content (≥60%). Dissolve a pea-sized amount in warm water or milk daily.",
        price: { inr: 1800, usd: 21.60 },
        b2b_pricing: B2B_TIERS,
        traceability: {
            village_of_origin: "Uttarkashi, Uttarakhand",
            artisan_name: "Himalayan Shilajit Harvesters Collective",
            certification_id: "AYUSH-UK-2025-0042",
        },
        scientific_attributes: {
            altitude_m: 4500,
            fulvic_acid_pct: ">62",
            humic_acid_pct: ">15",
            heavy_metals: "Below ICMR limits",
            purification: "Traditional sun-dry + water purification",
            lab_tested: true,
        },
        images: [
            "https://picsum.photos/seed/shilajit-resin/600/400",
            "https://picsum.photos/seed/shilajit-jar/600/400",
        ],
        seo: {
            title: "Purified Shilajit Resin Grade A 10g — From 4500m Altitude | Devbhoomi",
            description:
                "Authentic Grade-A Shilajit resin from Uttarkashi. >62% fulvic acid, AYUSH compliant, lab-tested. Traditional purification method.",
            keywords: ["shilajit", "shilajit resin", "fulvic acid", "himalayan shilajit", "uttarkashi"],
        },
        inventory: { retail: 195, wholesale: 2000 },
        moq: { wholesale: 50 },
        weight_kg: 0.025,
        dimensions_cm: { l: 5, w: 5, h: 7 },
        status: "active",
        created_at: "2026-01-18T08:00:00Z",
        updated_at: "2026-03-09T10:00:00Z",
    },
    {
        id: "prod_ashwagandha_powder_001",
        name: "Ashwagandha Root Powder — Wild-Harvested (100g)",
        slug: "ashwagandha-root-powder-100g",
        category: "wellness",
        subcategory: "traditional-supplements",
        description:
            "Withania somnifera roots wild-harvested from the foothills of Kumaon at 1,200–1,800 m altitude. Roots are shade-dried and stone-ground to retain bioactive withanolides. Lab-verified withanolides content ≥2.5%. Recommended dose: half a teaspoon in warm milk at night. Unlike commercial ashwagandha, this is pure root powder — no fillers, no extracts.",
        price: { inr: 380, usd: 4.55 },
        b2b_pricing: [
            { min_qty: 100, max_qty: 500, discount_pct: 12 },
            { min_qty: 501, discount_pct: 20 },
        ],
        traceability: {
            village_of_origin: "Ranikhet, Uttarakhand",
            artisan_name: "Vanaushadhi Sangrah SHG",
            certification_id: "NPOP-UK-2024-1556",
        },
        scientific_attributes: {
            species: "Withania somnifera",
            withanolides_pct: ">2.5",
            altitude_m: 1500,
            drying_method: "Shade-dried",
            form: "Root powder (not extract)",
            additives: "None",
        },
        images: [
            "https://picsum.photos/seed/ashwagandha-powder/600/400",
            "https://picsum.photos/seed/ashwagandha-root/600/400",
        ],
        seo: {
            title: "Wild Ashwagandha Root Powder 100g — >2.5% Withanolides | Devbhoomi",
            description:
                "Wild-harvested ashwagandha from Ranikhet, Uttarakhand. Pure root powder, no fillers. >2.5% withanolides, NPOP organic certified.",
            keywords: ["ashwagandha", "ashwagandha powder", "withanolides", "adaptogen", "ranikhet", "ayurveda"],
        },
        inventory: { retail: 430, wholesale: 8000 },
        moq: { wholesale: 100 },
        weight_kg: 0.12,
        dimensions_cm: { l: 10, w: 8, h: 16 },
        status: "active",
        created_at: "2026-01-22T08:00:00Z",
        updated_at: "2026-03-11T10:00:00Z",
    },
    {
        id: "prod_seabuckthorn_juice_001",
        name: "Sea Buckthorn Berry Juice (250ml)",
        slug: "sea-buckthorn-berry-juice-250ml",
        category: "wellness",
        subcategory: "personal-care",
        description:
            "Cold-pressed from wild Hippophae rhamnoides berries harvested in the trans-Himalayan valley of Munsiyari at 3,000 m altitude. One of nature's richest sources of Vitamin C (15× more than oranges), Omega-7 fatty acids, and beta-carotene. Tart and intensely flavoured — dilute 30ml in 200ml water daily. No added sugar, preservatives, or water.",
        price: { inr: 680, usd: 8.15 },
        b2b_pricing: [
            { min_qty: 50, max_qty: 200, discount_pct: 10 },
            { min_qty: 201, discount_pct: 18 },
        ],
        traceability: {
            village_of_origin: "Munsiyari, Uttarakhand",
            artisan_name: "Himalayan Berry Growers Co-op",
            certification_id: "NPOP-UK-2025-0321",
        },
        scientific_attributes: {
            species: "Hippophae rhamnoides",
            altitude_m: 3000,
            vitamin_c_per_100g_mg: 695,
            omega_7_pct: 2.8,
            extraction: "Cold-pressed",
            preservatives: "None",
            sugar_added: false,
        },
        images: [
            "https://picsum.photos/seed/seabuckthorn-juice/600/400",
            "https://picsum.photos/seed/seabuckthorn-berries/600/400",
        ],
        seo: {
            title: "Sea Buckthorn Berry Juice 250ml — Cold-Pressed, 3000m Altitude | Devbhoomi",
            description:
                "Pure cold-pressed sea buckthorn juice from Munsiyari. Rich in Vitamin C, Omega-7. No sugar, no preservatives. NPOP organic.",
            keywords: ["sea buckthorn", "seabuckthorn juice", "vitamin c", "omega 7", "himalayan berry"],
        },
        inventory: { retail: 168, wholesale: 3000 },
        moq: { wholesale: 50 },
        weight_kg: 0.32,
        dimensions_cm: { l: 6, w: 6, h: 20 },
        status: "active",
        created_at: "2026-02-05T08:00:00Z",
        updated_at: "2026-03-10T10:00:00Z",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// All mock products combined
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
    ...SACRED_PRODUCTS,
    ...FOODS_PRODUCTS,
    ...WELLNESS_PRODUCTS,
];

/** Quick lookup by slug — O(1) */
export const MOCK_PRODUCTS_BY_SLUG = new Map(
    MOCK_PRODUCTS.map((p) => [p.slug, p])
);
