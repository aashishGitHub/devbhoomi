-- ─────────────────────────────────────────────────────────────────────────────
-- 004 — Seed required products (Janeu, Ghee, Honey, Cow Dung, Sacred Puja Samagri)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO products (
    name, slug, category, subcategory, description,
    price_inr, price_usd, b2b_pricing, traceability,
    images, seo, inventory_retail, inventory_wholesale,
    weight_kg, status, variants
) VALUES
(
    'Sacred Janeu (Yagyopavit)',
    'sacred-janeu',
    'sacred', 'janeu',
    'A thread of purity and tradition',
    501, 6.01,
    '[{"min_qty":50,"max_qty":200,"discount_pct":10},{"min_qty":201,"max_qty":500,"discount_pct":18},{"min_qty":501,"discount_pct":25}]',
    '{"village_of_origin":"Almora, Uttarakhand","artisan_name":"Local Artisans","certification_id":"NPOP-UK-2024-1501"}',
    ARRAY['https://picsum.photos/seed/janeu/600/400'],
    '{"title":"Sacred Janeu (Yagyopavit) — Authentic from Uttarakhand","description":"Handcrafted sacred Janeu thread of purity and tradition.","keywords":["janeu","yagyopavit","sacred thread","puja"]}',
    500, 2000,
    0.020, 'active',
    '[{"name":"Pack of 5","price_inr":501,"inventory":500,"sku":"JANEU-5"},{"name":"Pack of 12","price_inr":1101,"inventory":300,"sku":"JANEU-12"}]'
),
(
    'Himalayan A2 Cow Ghee',
    'himalayan-cow-ghee',
    'foods', 'ghee',
    'Sacred nourishment from the Himalayas',
    699, 8.39,
    '[{"min_qty":24,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Chamoli, Uttarakhand","artisan_name":"Geeta Rawat","certification_id":"NPOP-UK-2024-0446"}',
    ARRAY['https://picsum.photos/seed/cow-ghee/600/400'],
    '{"title":"Himalayan A2 Cow Ghee 500g","description":"Pure A2 cow ghee from the Himalayas, sacred nourishment.","keywords":["ghee","a2 ghee","himalayan ghee","cow ghee"]}',
    200, 3000,
    0.550, 'active',
    '[{"name":"500g","price_inr":699,"inventory":200,"sku":"GHEE-500"}]'
),
(
    'Wild Himalayan Honey',
    'wild-himalayan-honey',
    'foods', 'honey',
    'Nature''s sweetness in its purest form',
    699, 8.39,
    '[{"min_qty":24,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Uttarkashi, Uttarakhand","artisan_name":"Deepak Negi","certification_id":"NPOP-UK-2024-0790"}',
    ARRAY['https://picsum.photos/seed/wild-honey/600/400'],
    '{"title":"Wild Himalayan Honey 500g","description":"Pure wild honey harvested at 3000 meters in the Himalayas.","keywords":["honey","himalayan honey","wild honey","organic"]}',
    350, 5000,
    0.540, 'active',
    '[{"name":"500g","price_inr":699,"inventory":350,"sku":"HONEY-500"}]'
),
(
    'Sacred Cow Dung Cakes',
    'sacred-cow-dung',
    'sacred', 'cow-dung',
    'Sacred purity for spiritual rituals',
    199, 2.39,
    '[{"min_qty":50,"max_qty":200,"discount_pct":10},{"min_qty":201,"max_qty":500,"discount_pct":18},{"min_qty":501,"discount_pct":25}]',
    '{"village_of_origin":"Almora, Uttarakhand","certification_id":"NPOP-UK-2024-1601"}',
    ARRAY['https://picsum.photos/seed/cow-dung/600/400'],
    '{"title":"Sacred Cow Dung Cakes — For Spiritual Rituals","description":"Pure cow dung cakes for havan and spiritual rituals.","keywords":["cow dung","havan","ritual","sacred"]}',
    800, 5000,
    0.120, 'active',
    '[{"name":"100g","price_inr":199,"inventory":800,"sku":"COWDUNG-100"},{"name":"500g","price_inr":499,"inventory":400,"sku":"COWDUNG-500"}]'
),
(
    'Sacred Puja Samagri',
    'sacred-puja-samagri',
    'sacred', 'puja-material',
    'Carefully curated sacred puja samagri, thoughtfully packed for Shivarchan, Rudrabhishek, Satyanarayan Katha, Navratri Pujan, Kanya Pujan, and Namkaran Sanskar, ensuring purity and ritual completeness.',
    999, 12.00,
    '[{"min_qty":20,"max_qty":99,"discount_pct":10},{"min_qty":100,"max_qty":499,"discount_pct":18},{"min_qty":500,"discount_pct":25}]',
    '{"village_of_origin":"Haridwar, Uttarakhand","artisan_name":"Local Pandits","certification_id":"NPOP-UK-2024-1701"}',
    ARRAY['https://picsum.photos/seed/puja-samagri/600/400'],
    '{"title":"Sacred Puja Samagri — Complete Ritual Kit","description":"Complete puja samagri for all major Hindu rituals and ceremonies.","keywords":["puja samagri","havan","ritual","sacred","shivarchan","rudrabhishek"]}',
    150, 1000,
    0.500, 'active',
    '[]'
)

ON CONFLICT (slug) DO NOTHING;
