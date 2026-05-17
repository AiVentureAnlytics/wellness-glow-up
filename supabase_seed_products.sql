-- ============================================================
-- CJ HEALTH SUPPLY — Seed inicial de productos
-- Correr DESPUÉS de supabase_setup.sql, en SQL Editor
-- ============================================================

-- Limpiar productos previos (solo si vuelves a sembrar)
-- delete from products;

insert into products (id, name, description, details, price, img, category, section, badge, stock) values

-- ========== PROTEÍNAS ==========
('dymatize-iso100-908',
 'Dymatize ISO·100 Hydrolyzed',
 '908g · Hidrolizada de absorción ultra rápida. 25g de proteína por servicio.',
 '["25g de proteína hidrolizada por porción", "Absorción ultra rápida (post-entreno)", "Bajo en azúcar y grasa (<1g)", "908g por envase (~28 porciones)", "Sin gluten, sabor chocolate fudge"]'::jsonb,
 44990, '/products/dymatize-whey.webp', 'proteinas', 'Suplementos', 'Top venta', 20),

('dymatize-elite-2lb',
 'Dymatize Elite Whey Chocolate',
 '2lb · Chocolate · Whey concentrada premium con 24g de proteína por servicio.',
 '["24g de proteína por porción", "Sabor chocolate cremoso", "907g (2lb) por envase (~28 porciones)", "Fórmula clásica probada", "Excelente perfil de aminoácidos"]'::jsonb,
 32990, '/products/dymatize-whey.webp', 'proteinas', 'Suplementos', null, 15),

('ostrovit-whey-2000',
 'OstroVit 100% Whey Protein 2kg',
 '2000g · 5 sabores · La opción rendimiento/precio más popular.',
 '["22g de proteína por porción", "2000g por envase (~66 porciones)", "5 sabores disponibles", "Bajo costo por gramo de proteína", "Ideal para volumen y mantenimiento"]'::jsonb,
 54990, '/products/ostrovit-whey-2000.webp', 'proteinas', 'Suplementos', 'Mejor precio', 30),

('ostrovit-whey-4lb',
 'OstroVit Whey 4lb Chocolate',
 '1.8kg · Chocolate intenso · Para entrenamientos exigentes.',
 '["22g de proteína por porción", "1.8kg (4lb) por envase (~60 porciones)", "Sabor chocolate intenso", "Excelente solubilidad", "Trazabilidad de lote certificada"]'::jsonb,
 49990, '/products/ostrovit-whey-2000.webp', 'proteinas', 'Suplementos', null, 18),

('ostrovit-whey-700',
 'OstroVit Whey Protein 700g Chocolate',
 '700g · Chocolate · Ideal para empezar o complementar.',
 '["22g de proteína por porción", "700g por envase (~23 porciones)", "Sabor chocolate", "Tamaño ideal para probar la marca", "Mezcla fácil con agua o leche"]'::jsonb,
 23990, '/products/ostrovit-whey-700.png', 'proteinas', 'Suplementos', null, 25),

('ostrovit-whey-vainilla-700',
 'OstroVit Whey Vainilla 700g',
 '700g · Vainilla · Sabor suave, perfecto para mezclar.',
 '["22g de proteína por porción", "700g por envase (~23 porciones)", "Sabor vainilla suave", "Mezcla en batidos, café o yogurt", "Sin sabores artificiales fuertes"]'::jsonb,
 23990, '/products/ostrovit-whey-700.png', 'proteinas', 'Suplementos', null, 22),

-- ========== CREATINAS ==========
('ostrovit-creatina-300',
 'OstroVit Creatina Monohidratada 300g',
 '300g · Sin sabor · El suplemento más estudiado para fuerza y volumen.',
 '["5g de creatina monohidratada por porción", "300g por envase (~60 porciones)", "Micronizada para mejor absorción", "Sin sabor, disuelve completamente", "El suplemento más respaldado científicamente"]'::jsonb,
 13050, '/products/ostrovit-creatina.jpg', 'creatinas', 'Suplementos', 'Best seller', 40),

('dymatize-creapure-300',
 'Dymatize Creatina Creapure 300g',
 '300g · Creapure alemana · Máxima pureza certificada.',
 '["5g de Creapure (creatina alemana) por porción", "Certificación Creapure de máxima pureza", "300g por envase (~60 porciones)", "Sin sabor, fácil disolución", "El estándar de oro en creatinas"]'::jsonb,
 32990, '/products/dymatize-creapure.jpg', 'creatinas', 'Suplementos', null, 12),

-- ========== VITAMINAS & MINERALES ==========
('ostrovit-omega3-90',
 'OstroVit Omega 3 Extreme 90 caps',
 '90 cápsulas · EPA + DHA · Cardiovascular y antiinflamatorio.',
 '["1000mg de aceite de pescado por cápsula", "EPA 330mg + DHA 220mg", "90 cápsulas por envase (3 meses)", "Salud cardiovascular y cerebral", "Propiedades antiinflamatorias"]'::jsonb,
 15950, '/products/ostrovit-omega3.jpg', 'vitaminas', 'Suplementos', null, 35),

('ostrovit-magnesio-90',
 'OstroVit Magnesio + B6',
 '90 tabs · 400mg + B6 · Relajación, sueño y recuperación.',
 '["400mg de magnesio por tableta", "Con vitamina B6 (mejor absorción)", "90 tabletas (3 meses)", "Reduce calambres y tensión muscular", "Mejora la calidad del sueño"]'::jsonb,
 12990, '/products/ostrovit-magnesio.jpg', 'vitaminas', 'Suplementos', 'Recovery', 28),

('ostrovit-vitamina-c',
 'OstroVit Vitamina C 1000mg',
 '90 tabs · Inmunidad y antioxidante. Dosis terapéutica diaria.',
 '["1000mg de vitamina C por tableta", "Refuerza el sistema inmune", "90 tabletas por envase", "Antioxidante natural", "Mejora absorción de hierro"]'::jsonb,
 9990, '/products/vitamina-c.jpg', 'vitaminas', 'Suplementos', null, 50),

('ostrovit-zma',
 'OstroVit ZMA',
 '90 caps · Zinc + Magnesio + B6 · Testosterona natural y sueño.',
 '["Zinc 30mg + Magnesio 450mg + B6 10mg", "90 cápsulas por envase", "Apoya niveles naturales de testosterona", "Mejora calidad del sueño profundo", "Tomar antes de dormir"]'::jsonb,
 14990, '/products/zma.jpg', 'vitaminas', 'Suplementos', null, 20),

-- ========== ENERGÍA ==========
('ostrovit-cafeina',
 'OstroVit Cafeína 200mg',
 '100 tabs · Energía y enfoque · Ideal antes de entrenar o estudiar.',
 '["200mg de cafeína anhidra por tableta", "100 tabletas por envase", "Energía y enfoque mental", "Ideal pre-entrenamiento o estudio", "Sin azúcar ni calorías"]'::jsonb,
 8990, '/products/cafeina.jpg', 'energia', 'Suplementos', 'Focus', 30),

-- ========== WELLNESS ==========
('well-lentes-blue',
 'Lentes de Bloqueo Azul (Nightime)',
 'Mejora tu melatonina y duerme profundamente.',
 '["Bloquea el 99% de la luz azul nociva", "Mejora la producción natural de melatonina", "Diseño liviano para uso prolongado", "Ideal para uso nocturno frente a pantallas", "Incluye estuche protector"]'::jsonb,
 25000, '/products/night-glasses.jpg', 'wellness', 'Wellness', null, 15),

('well-desodorante-natural',
 'Desodorante Natural',
 'Sin aluminio ni químicos. Protección natural todo el día.',
 '["Libre de aluminio, parabenos y alcohol", "Ingredientes 100% naturales", "Protección efectiva 24 horas", "Apto para pieles sensibles", "Envase eco-friendly"]'::jsonb,
 7990, '/products/desodorante.jpg', 'wellness', 'Wellness', null, 25),

('well-pasta-dental',
 'Pasta de Dientes Natural',
 'Ingredientes orgánicos, sin flúor. Cuidado bucal consciente.',
 '["Sin flúor, SLS ni parabenos", "Ingredientes orgánicos certificados", "Blanqueamiento con carbón activado", "Sabor menta fresca natural", "Tubo reciclable 100ml"]'::jsonb,
 5990, '/products/pasta-dientes.jpg', 'wellness', 'Wellness', null, 30),

('well-antifaz-seda',
 'Antifaz para Dormir',
 'Seda premium con bloqueo total de luz. Sueño reparador.',
 '["100% seda de morera natural", "Bloqueo total de luz", "Correa ajustable ultra-suave", "No deja marcas en la piel", "Incluye bolsa de viaje"]'::jsonb,
 12990, '/products/antifaz.jpg', 'wellness', 'Wellness', null, 18),

-- ========== WEARABLES ==========
('helio-strap',
 'Amazfit Helio Strap',
 'Wearable sin pantalla para atletas. Recuperación, sueño y entreno en datos.',
 '["Batería de hasta 8 días continuos", "Resistente al agua 5 ATM", "Sin pantalla: cero distracciones", "FC + SpO₂ + HRV continuos", "App Zepp + Strava + Apple Health"]'::jsonb,
 140000, '/products/helio-strap.jpg', 'wearables', 'Wearables', 'Nuevo en Chile', 8),

('strap-naranja',
 'Correa Sport Naranja para Helio',
 'Silicona deportiva, resistente al agua. Color naranja vibrante.',
 '["Silicona médica hipoalergénica", "Resistente al agua y sudor", "Cierre seguro ajustable", "Compatible con Amazfit Helio Strap", "Color naranja vibrante"]'::jsonb,
 15000, '/products/strap-orange.jpg', 'wearables', 'Wearables', null, 10),

('strap-verde',
 'Correa Táctica Verde para Helio',
 'Tejido militar transpirable, estilo outdoor.',
 '["Tejido militar transpirable", "Estilo outdoor / táctico", "Cierre con velcro reforzado", "Compatible con Amazfit Helio Strap", "Color verde militar"]'::jsonb,
 18000, '/products/strap-green.jpg', 'wearables', 'Wearables', null, 12),

('strap-cuero-negro',
 'Correa Cuero Negro para Helio',
 'Cuero premium, look elegante y sofisticado.',
 '["Cuero genuino premium", "Look elegante / sofisticado", "Cierre con hebilla metálica", "Compatible con Amazfit Helio Strap", "Color negro mate"]'::jsonb,
 22000, '/products/strap-black.jpg', 'wearables', 'Wearables', null, 6)

on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  details = excluded.details,
  price = excluded.price,
  img = excluded.img,
  category = excluded.category,
  section = excluded.section,
  badge = excluded.badge,
  stock = excluded.stock,
  active = true,
  updated_at = now();

-- Verificación
select section, count(*) as cant from products group by section;
