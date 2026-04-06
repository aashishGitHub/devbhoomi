-- ─────────────────────────────────────────────────────────────────────────────
-- Devbhoomi — Seed Data (idempotent via ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO products (
    name, slug, category, subcategory, description,
    price_inr, price_usd, b2b_pricing, traceability, scientific_attributes,
    images, seo, inventory_retail, inventory_wholesale, moq_wholesale,
    weight_kg, status
) VALUES
-- SACRED ──────────────────────────────────────────────────────────────────────
(
    '5 Mukhi Rudraksha Mala (108 Beads)',
    '5-mukhi-rudraksha-mala',
    'sacred', 'rudraksha',
    'Strung with 108 authentic 5-face Rudraksha beads hand-selected in Rishikesh. Each bead is sourced from mature Elaeocarpus ganitrus trees at altitudes above 2,000 m. Comes in a handwoven jute pouch with a certificate of authenticity.',
    1800, 21.60,
    '[{"min_qty":50,"max_qty":200,"discount_pct":10},{"min_qty":201,"max_qty":500,"discount_pct":18},{"min_qty":501,"discount_pct":25}]',
    '{"village_of_origin":"Rishikesh, Uttarakhand","artisan_name":"Ramesh Joshi","certification_id":"NPOP-UK-2024-0892"}',
    '{"mukhi_count":5,"bead_count":108,"avg_bead_diameter_mm":8,"species":"Elaeocarpus ganitrus","altitude_m":2100}',
    ARRAY['https://picsum.photos/seed/rudraksha-mala/600/400','https://picsum.photos/seed/rudraksha-close/600/400'],
    '{"title":"5 Mukhi Rudraksha Mala — Authentic from Rishikesh","description":"Genuine 5-face Rudraksha mala, 108 beads, NPOP certified.","keywords":["rudraksha","5 mukhi","mala","108 beads"]}',
    240, 4800, 50, 0.085, 'active'
),
(
    'Bambooless Dhoop Cones — Temple Flower Blend',
    'bambooless-dhoop-cones',
    'sacred', 'incense',
    'Handcrafted dhoop cones made from recycled marigold and rose petals collected from Haridwar temples. Zero-plastic, zero-bamboo, zero synthetic fragrance. Burns for 25–30 minutes with a rich, grounding fragrance.',
    349, 4.20,
    '[{"min_qty":50,"max_qty":200,"discount_pct":10},{"min_qty":201,"max_qty":500,"discount_pct":18},{"min_qty":501,"discount_pct":25}]',
    '{"village_of_origin":"Haridwar, Uttarakhand","artisan_name":"Savitri Devi","certification_id":"NPOP-UK-2024-1203"}',
    '{"burn_time_min":28,"cones_per_pack":20,"fragrance":"Temple Marigold","charcoal_free":true}',
    ARRAY['https://picsum.photos/seed/dhoop-cones/600/400'],
    '{"title":"Bambooless Dhoop Cones — Temple Flower Blend","description":"Eco-friendly dhoop cones made from recycled temple flowers, Haridwar.","keywords":["dhoop","incense","temple","eco-friendly"]}',
    850, 12000, 50, 0.150, 'active'
),

-- FOODS ───────────────────────────────────────────────────────────────────────
(
    'A2 Bilona Ghee — Badri Cow (500ml)',
    'a2-bilona-ghee-500ml',
    'foods', 'ghee',
    'Traditional Bilona-method ghee made from the milk of indigenous Badrinath cows pastured at 3,200m in the Chamoli district. Hand-churned using wooden bilona, then slow-cooked in clay pots. No additives, no preservatives.',
    1450, 17.40,
    '[{"min_qty":24,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Chamoli, Uttarakhand","artisan_name":"Geeta Rawat","certification_id":"NPOP-UK-2024-0445"}',
    '{"fat_percentage":99.8,"a2_certified":true,"cow_breed":"Badri","method":"Bilona","altitude_m":3200}',
    ARRAY['https://picsum.photos/seed/bilona-ghee/600/400','https://picsum.photos/seed/bilona-ghee-pour/600/400'],
    '{"title":"A2 Bilona Ghee — Badri Cow 500ml | Chamoli, Uttarakhand","description":"Traditional Bilona-method A2 ghee from Badri cows at 3200m altitude.","keywords":["a2 ghee","bilona","badri cow","uttarakhand"]}',
    180, 2400, 24, 0.620, 'active'
),
(
    'Raw Himalayan Forest Honey — Clover Blend (500g)',
    'raw-himalayan-honey-clover-500g',
    'foods', 'honey',
    'Wild-harvested from beehives in the Uttarkashi oak forests at altitudes of 1,800–2,400m. Unpasteurised, unfiltered, retaining all natural enzymes and pollen. Rich amber colour, crystallises naturally in winter.',
    899, 10.80,
    '[{"min_qty":24,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Uttarkashi, Uttarakhand","artisan_name":"Deepak Negi","certification_id":"NPOP-UK-2024-0789"}',
    '{"raw":true,"unpasteurised":true,"altitude_m":2100,"harvest_season":"Oct–Nov","brix":79.5}',
    ARRAY['https://picsum.photos/seed/himalayan-honey/600/400'],
    '{"title":"Raw Himalayan Forest Honey 500g — Uttarkashi","description":"Wild-harvested, unpasteurised Himalayan honey from Uttarkashi oak forests.","keywords":["himalayan honey","raw honey","forest honey","uttarkashi"]}',
    420, 6000, 24, 0.540, 'active'
),
(
    'Mandua (Ragi) Flour — Stone-Ground (1kg)',
    'mandua-ragi-flour-1kg',
    'foods', 'grains',
    'Stone-ground finger millet flour from the Pauri Garhwal highlands at 1,600m. Mandua is a traditional Uttarakhand crop grown without chemical fertilisers since ancient times. Rich in calcium, iron, and dietary fibre.',
    280, 3.36,
    '[{"min_qty":50,"max_qty":200,"discount_pct":10},{"min_qty":201,"max_qty":500,"discount_pct":18},{"min_qty":501,"discount_pct":25}]',
    '{"village_of_origin":"Pauri Garhwal, Uttarakhand","certification_id":"NPOP-UK-2024-1099"}',
    '{"grain":"Eleusine coracana","calcium_mg_per_100g":344,"iron_mg_per_100g":3.9,"altitude_m":1600,"milling":"stone-ground","organic":true}',
    ARRAY['https://picsum.photos/seed/ragi-flour/600/400'],
    '{"title":"Mandua Ragi Flour 1kg — Stone-Ground Pauri Garhwal","description":"Traditional stone-ground finger millet flour, organically grown in Uttarakhand highlands.","keywords":["ragi","mandua","finger millet","stone ground","organic"]}',
    620, 8000, 50, 1.050, 'active'
),

-- WELLNESS ────────────────────────────────────────────────────────────────────
(
    'Purified Himalayan Shilajit — Resin (20g)',
    'himalayan-shilajit-resin-20g',
    'wellness', 'supplements',
    'Sustainably sourced from 4,500m altitude rocks in the Kedarnath Wildlife Sanctuary. Triple-purified using traditional Shodhana method. Lab-tested for heavy metals. Fulvic acid content ≥65%. No fillers, no additives.',
    1899, 22.80,
    '[{"min_qty":20,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Kedarnath, Uttarakhand","certification_id":"NPOP-UK-2024-0321"}',
    '{"fulvic_acid_pct":65,"purification":"Triple Shodhana","altitude_m":4500,"heavy_metal_tested":true,"form":"resin"}',
    ARRAY['https://picsum.photos/seed/shilajit-resin/600/400','https://picsum.photos/seed/shilajit-open/600/400'],
    '{"title":"Purified Himalayan Shilajit Resin 20g — Kedarnath","description":"Lab-tested Himalayan Shilajit, 65%+ fulvic acid, sourced from 4500m altitude.","keywords":["shilajit","himalayan shilajit","fulvic acid","ayurveda"]}',
    95, 1200, 20, 0.045, 'active'
)

ON CONFLICT (slug) DO NOTHING;
