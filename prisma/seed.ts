// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ALL_RULES } from "../src/server/compliance/rules";
import { evaluateCompliance } from "../src/server/compliance/engine";

const prisma = new PrismaClient();

const BRANDS = [
  { slug: "primal-pantry", name: "Primal Pantry", tagline: "Ancestral, clean, honest.", story: "Small-batch tallow and clean pantry staples from regenerative farms." },
  { slug: "golden-grove", name: "Golden Grove", tagline: "First-press, single-origin olive oils.", story: "California groves, cold-pressed within hours of harvest." },
  { slug: "apex-provisions", name: "Apex Provisions", tagline: "Grass-fed, field-harvested.", story: "Meat snacks from regenerative ranches." },
  { slug: "meadow-and-hive", name: "Meadow & Hive", tagline: "Raw, traceable honey.", story: "Single-origin wildflower honey from family apiaries." },
  { slug: "root-ritual", name: "Root Ritual", tagline: "Functional beverages, clean formulas.", story: "Electrolytes and teas without fillers." },
  { slug: "stone-mill", name: "Stone Mill", tagline: "Heritage grains, nothing else.", story: "Einkorn, spelt, and stone-ground wheat pastas." },
];

const CATEGORIES = [
  { slug: "cooking-fats", name: "Cooking Fats", sortOrder: 1, description: "Traditional fats. Stable under heat. No seed oils, ever." },
  { slug: "pantry-staples", name: "Pantry Staples", sortOrder: 2, description: "The building blocks of a clean kitchen." },
  { slug: "snacks", name: "Snacks", sortOrder: 3, description: "Snacks with ingredient lists you can read." },
  { slug: "beverages", name: "Beverages", sortOrder: 4, description: "Drinks without the chemistry set." },
  { slug: "condiments", name: "Condiments", sortOrder: 5, description: "Flavor without the fillers." },
  { slug: "protein", name: "Protein & Meat Snacks", sortOrder: 6, description: "Grass-fed, field-harvested, minimally processed." },
];

const BADGES = [
  { slug: "seed-oil-free", name: "Seed Oil Free", iconName: "shield-check", description: "No canola, soy, sunflower, safflower, corn, or other industrial seed oils." },
  { slug: "zero-compromise-approved", name: "Zero Compromise Approved", iconName: "check-circle", description: "Passed our full ingredient review." },
  { slug: "no-artificial", name: "No Artificial Ingredients", iconName: "leaf", description: "No artificial flavors, colors, or preservatives." },
  { slug: "minimal-ingredients", name: "Minimal Ingredient List", iconName: "list-minus", description: "Five or fewer ingredients." },
  { slug: "transparent-sourcing", name: "Transparent Sourcing", iconName: "map-pin", description: "Brand discloses farm, region, or origin." },
];

const PRODUCTS = [
  {
    slug: "grass-fed-beef-tallow",
    title: "Grass-Fed Beef Tallow",
    subtitle: "Rendered from 100% grass-finished cattle",
    brandSlug: "primal-pantry",
    categorySlugs: ["cooking-fats", "pantry-staples"],
    priceCents: 1895,
    inventoryQty: 120,
    image: "https://images.unsplash.com/photo-1589552416260-02ac88d3eaed?w=800",
    description: "Traditional rendered tallow from regeneratively raised cattle. Shelf-stable, ultra-high smoke point, deeply nourishing. One ingredient.",
    whyItPassed: "Single ingredient: grass-fed beef fat. No seed oils. No preservatives. Traditional wet-rendered method preserves fat-soluble vitamins.",
    ingredients: [{ name: "Grass-fed beef tallow" }],
    rawIngredients: "100% grass-fed beef tallow",
    badges: ["seed-oil-free", "zero-compromise-approved", "minimal-ingredients", "transparent-sourcing"],
    featured: true, staffPick: true,
  },
  {
    slug: "extra-virgin-olive-oil-500ml",
    title: "Extra Virgin Olive Oil — Early Harvest",
    subtitle: "Cold-pressed within 4 hours of harvest",
    brandSlug: "golden-grove",
    categorySlugs: ["cooking-fats"],
    priceCents: 3400,
    inventoryQty: 80,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800",
    description: "Single-estate, early-harvest California olive oil. High polyphenol count, peppery finish. Third-party tested for adulteration.",
    whyItPassed: "Single-origin, cold-pressed, third-party tested. No blending, no refining, no heat.",
    ingredients: [{ name: "Extra virgin olive oil" }],
    rawIngredients: "100% extra virgin olive oil, cold-pressed",
    badges: ["seed-oil-free", "zero-compromise-approved", "minimal-ingredients", "transparent-sourcing"],
    featured: true,
  },
  {
    slug: "avocado-oil-single-origin",
    title: "Single-Origin Avocado Oil",
    subtitle: "Cold-pressed, never refined",
    brandSlug: "golden-grove",
    categorySlugs: ["cooking-fats"],
    priceCents: 2400,
    inventoryQty: 100,
    image: "https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=800",
    description: "Cold-pressed avocado oil. Adulteration-tested — a major problem in this category.",
    whyItPassed: "Third-party verified as 100% avocado oil. No seed oil blending.",
    ingredients: [{ name: "Avocado oil" }],
    rawIngredients: "100% cold-pressed avocado oil",
    badges: ["seed-oil-free", "zero-compromise-approved", "minimal-ingredients"],
    featured: true,
  },
  {
    slug: "electrolyte-powder-unsweetened",
    title: "Electrolyte Powder — Unsweetened Lemon",
    subtitle: "No sugar, no dextrose, no fillers",
    brandSlug: "root-ritual",
    categorySlugs: ["beverages"],
    priceCents: 3200,
    inventoryQty: 200,
    image: "https://images.unsplash.com/photo-1548945898-a7dcc1ddfdfb?w=800",
    description: "Clean electrolyte formula: sodium, potassium, magnesium. Real lemon. That's it.",
    whyItPassed: "No maltodextrin, no dextrose, no artificial flavors, no sucralose. Real lemon powder.",
    ingredients: [
      { name: "Sodium chloride (Celtic sea salt)" },
      { name: "Potassium chloride" },
      { name: "Magnesium malate" },
      { name: "Lemon juice powder" },
    ],
    rawIngredients: "Celtic sea salt, potassium chloride, magnesium malate, lemon juice powder",
    badges: ["zero-compromise-approved", "minimal-ingredients", "no-artificial"],
    featured: true, staffPick: true,
  },
  {
    slug: "raw-wildflower-honey",
    title: "Raw Wildflower Honey — 16 oz",
    subtitle: "Single-apiary, unfiltered",
    brandSlug: "meadow-and-hive",
    categorySlugs: ["pantry-staples"],
    priceCents: 1800,
    inventoryQty: 150,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
    description: "Unfiltered, unheated raw honey from a single family apiary in Vermont.",
    whyItPassed: "Single ingredient. Traceable to one apiary. Never heated, never filtered.",
    ingredients: [{ name: "Raw wildflower honey" }],
    rawIngredients: "100% raw wildflower honey",
    badges: ["zero-compromise-approved", "minimal-ingredients", "transparent-sourcing"],
    featured: true,
  },
  {
    slug: "grass-fed-beef-jerky-original",
    title: "Grass-Fed Beef Jerky — Original",
    subtitle: "Five ingredients. That's it.",
    brandSlug: "apex-provisions",
    categorySlugs: ["protein", "snacks"],
    priceCents: 1295,
    inventoryQty: 300,
    image: "https://images.unsplash.com/photo-1625937329935-287441889b2e?w=800",
    description: "Grass-fed, grass-finished beef, slow-dried. No sugar, no soy, no preservatives.",
    whyItPassed: "No sugar, no soy sauce, no preservatives. No caramel color or natural flavors.",
    ingredients: [
      { name: "Grass-fed beef" },
      { name: "Sea salt" },
      { name: "Black pepper" },
      { name: "Garlic" },
      { name: "Apple cider vinegar" },
    ],
    rawIngredients: "Grass-fed beef, sea salt, black pepper, garlic, apple cider vinegar",
    badges: ["seed-oil-free", "zero-compromise-approved", "minimal-ingredients"],
    featured: true, staffPick: true,
  },
  {
    slug: "dark-chocolate-85-cacao",
    title: "85% Dark Chocolate — Two Ingredients",
    brandSlug: "primal-pantry",
    categorySlugs: ["snacks"],
    priceCents: 795,
    inventoryQty: 400,
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800",
    description: "Organic cacao, organic cane sugar. Nothing else. No soy lecithin, no natural flavors.",
    whyItPassed: "No soy lecithin, no vanilla flavoring, no palm. Just cacao and sugar.",
    ingredients: [{ name: "Organic cacao" }, { name: "Organic cane sugar" }],
    rawIngredients: "Organic cacao, organic cane sugar",
    badges: ["zero-compromise-approved", "minimal-ingredients"],
    featured: true,
  },
  {
    slug: "einkorn-pasta-spaghetti",
    title: "Einkorn Spaghetti",
    subtitle: "Ancient grain, stone-ground",
    brandSlug: "stone-mill",
    categorySlugs: ["pantry-staples"],
    priceCents: 895,
    inventoryQty: 250,
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800",
    description: "Pasta made from einkorn, humanity's oldest cultivated wheat. Stone-ground whole grain.",
    whyItPassed: "Single-ingredient whole grain einkorn. No enrichment, no emulsifiers.",
    ingredients: [{ name: "Einkorn wheat flour" }],
    rawIngredients: "100% stone-ground einkorn wheat flour",
    badges: ["zero-compromise-approved", "minimal-ingredients", "transparent-sourcing"],
  },
  {
    slug: "heirloom-tomato-sauce",
    title: "Heirloom Tomato Sauce",
    subtitle: "Six ingredients, San Marzano tomatoes",
    brandSlug: "stone-mill",
    categorySlugs: ["condiments", "pantry-staples"],
    priceCents: 1195,
    inventoryQty: 180,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800",
    description: "Real tomato sauce. No seed oils, no sugar, no preservatives.",
    whyItPassed: "Cooked in olive oil (not canola). No added sugar, no preservatives.",
    ingredients: [
      { name: "San Marzano tomatoes" }, { name: "Extra virgin olive oil" },
      { name: "Sea salt" }, { name: "Garlic" },
      { name: "Fresh basil" }, { name: "Oregano" },
    ],
    rawIngredients: "San Marzano tomatoes, extra virgin olive oil, sea salt, garlic, basil, oregano",
    badges: ["seed-oil-free", "zero-compromise-approved", "no-artificial"],
  },
  {
    slug: "herbal-tea-sampler",
    title: "Herbal Tea Sampler",
    brandSlug: "root-ritual",
    categorySlugs: ["beverages"],
    priceCents: 2200,
    inventoryQty: 90,
    image: "https://images.unsplash.com/photo-1597318236864-1d1a8bc68cb6?w=800",
    description: "Five single-herb teas. No flavorings, no blends with mystery ingredients.",
    whyItPassed: "Single-herb teas, no natural flavors, no artificial anything.",
    ingredients: [
      { name: "Chamomile" }, { name: "Peppermint" }, { name: "Ginger root" },
      { name: "Rooibos" }, { name: "Lemon balm" },
    ],
    rawIngredients: "Chamomile, peppermint, ginger root, rooibos, lemon balm",
    badges: ["zero-compromise-approved", "minimal-ingredients", "no-artificial"],
  },
];

async function main() {
  console.log("🧹 Clearing existing data...");
  await prisma.$transaction([
    prisma.productBadge.deleteMany(),
    prisma.productIngredient.deleteMany(),
    prisma.productCategory.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.productSubscriptionOption.deleteMany(),
    prisma.complianceReview.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.review.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.product.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.category.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.ingredient.deleteMany(),
    prisma.complianceRule.deleteMany(),
    prisma.article.deleteMany(),
    prisma.fAQ.deleteMany(),
    prisma.userSubscription.deleteMany(),
    prisma.subscriptionPlan.deleteMany(),
    prisma.customerProfile.deleteMany(),
    prisma.address.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("⚖️  Seeding compliance rules...");
  for (const r of ALL_RULES) {
    await prisma.complianceRule.create({
      data: {
        type: r.severity === "BANNED" ? "BANNED_INGREDIENT" : "CAUTION_INGREDIENT",
        key: r.key, displayName: r.displayName, description: r.rationale,
      },
    });
  }

  console.log("🏷  Seeding badges...");
  for (const b of BADGES) await prisma.badge.create({ data: b });

  console.log("📂 Seeding categories...");
  for (const c of CATEGORIES) await prisma.category.create({ data: c });

  console.log("🏭 Seeding brands...");
  for (const b of BRANDS) await prisma.brand.create({ data: b });

  console.log("👥 Seeding users...");
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("user12345", 10);
  const admin = await prisma.user.create({
    data: { email: "admin@nocompromise.com", name: "Admin", role: "ADMIN", passwordHash: adminHash },
  });
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: { email: `customer${i}@example.com`, name: `Customer ${i}`, passwordHash: userHash },
    });
  }

  console.log("💳 Seeding subscription plans...");
  await prisma.subscriptionPlan.create({
    data: {
      slug: "member-monthly", name: "Zero Compromise — Monthly",
      description: "10% off every order, free shipping over $50, early access to new brands.",
      priceCents: 1500, interval: "MONTH", sortOrder: 1,
      perksJson: { shippingThreshold: 5000, discountPct: 10 },
    },
  });
  await prisma.subscriptionPlan.create({
    data: {
      slug: "member-annual", name: "Zero Compromise — Annual",
      description: "Everything in monthly, plus 2 months free.",
      priceCents: 14400, interval: "YEAR", sortOrder: 2,
      perksJson: { shippingThreshold: 5000, discountPct: 10, bonus: "2 months free" },
    },
  });

  console.log("🛒 Seeding products...");
  for (const p of PRODUCTS) {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: p.brandSlug } });
    const report = evaluateCompliance(p.rawIngredients);

    const product = await prisma.product.create({
      data: {
        slug: p.slug, title: p.title, subtitle: p.subtitle,
        description: p.description, whyItPassed: p.whyItPassed,
        status: report.result === "PASS" ? "APPROVED" : report.result === "FAIL" ? "REJECTED" : "UNDER_REVIEW",
        complianceResult: report.result, complianceNotes: report.summary,
        priceCents: p.priceCents, brandId: brand.id,
        isFeatured: p.featured ?? false, isStaffPick: p.staffPick ?? false, isNewArrival: true,
        inventoryQty: p.inventoryQty, rawIngredientsText: p.rawIngredients,
        publishedAt: report.result === "PASS" ? new Date() : null,
        images: { create: [{ url: p.image, alt: p.title, sortOrder: 0 }] },
        subscriptionOptions: {
          create: [
            { intervalDays: 30, discountPercent: 10 },
            { intervalDays: 60, discountPercent: 10 },
          ],
        },
      },
    });

    for (const catSlug of p.categorySlugs) {
      const cat = await prisma.category.findUniqueOrThrow({ where: { slug: catSlug } });
      await prisma.productCategory.create({ data: { productId: product.id, categoryId: cat.id } });
    }

    for (const badgeSlug of p.badges) {
      const badge = await prisma.badge.findUniqueOrThrow({ where: { slug: badgeSlug } });
      await prisma.productBadge.create({ data: { productId: product.id, badgeId: badge.id } });
    }

    for (let i = 0; i < p.ingredients.length; i++) {
      const ing = p.ingredients[i];
      const slug = ing.name.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      const ingredient = await prisma.ingredient.upsert({
        where: { slug },
        create: { slug, name: ing.name, severity: "CLEAN", aliases: [] },
        update: {},
      });
      await prisma.productIngredient.create({
        data: { productId: product.id, ingredientId: ingredient.id, position: i },
      });
    }

    await prisma.complianceReview.create({
      data: {
        productId: product.id, reviewerId: admin.id,
        result: report.result, notes: report.summary,
        flagged: [...report.banned, ...report.caution].map((f) => f.rule.key),
      },
    });
  }

  console.log("📝 Seeding articles...");
  const articles = [
    { slug: "why-we-ban-seed-oils", title: "Why We Ban Seed Oils — All Of Them",
      excerpt: "The strongest case against industrial seed oils, and why we won't compromise." },
    { slug: "reading-an-ingredient-label", title: "How To Read An Ingredient Label Like We Do",
      excerpt: "Our internal review checklist, now public." },
    { slug: "natural-flavors-what-they-hide", title: "'Natural Flavors' — And What They Hide",
      excerpt: "The FDA's most abused label term, explained." },
    { slug: "the-olive-oil-fraud-problem", title: "The Olive Oil Fraud Problem",
      excerpt: "Up to 80% of supermarket olive oil is adulterated. Here's how we verify." },
    { slug: "five-pantry-swaps", title: "Five Pantry Swaps That Matter More Than You Think",
      excerpt: "Small changes with compound effect." },
  ];
  for (const a of articles) {
    await prisma.article.create({
      data: {
        ...a,
        bodyMdx: `# ${a.title}\n\n${a.excerpt}\n\nThis is a seeded article. Replace the body with real MDX content from the admin panel.\n\n## A subheading\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. The real article will live here.`,
        status: "PUBLISHED", publishedAt: new Date(),
        authorName: "The NoCompromise Editors", readMinutes: 5,
        tags: ["standards", "education"],
      },
    });
  }

  console.log("❓ Seeding FAQs...");
  const faqs = [
    { question: "What does 'Zero Compromise Approved' mean?",
      answer: "Every product is screened against our banned and caution ingredient lists. Only products that pass — either automatically or after manual review — are listed.",
      category: "Standards", sortOrder: 1 },
    { question: "Why no seed oils?",
      answer: "Industrial seed oils are high in oxidized linoleic acid, heavily processed with hexane, and dominant in the modern inflammatory diet. We reject the entire category.",
      category: "Standards", sortOrder: 2 },
    { question: "Do you test products?",
      answer: "We review every label and verify with brands directly. For high-fraud categories like olive oil, we require third-party testing.",
      category: "Standards", sortOrder: 3 },
    { question: "How does membership work?",
      answer: "Members get 10% off every order, free shipping over $50, and early access to new drops. Cancel anytime.",
      category: "Membership", sortOrder: 4 },
    { question: "What's your return policy?",
      answer: "30-day satisfaction guarantee. If a product doesn't meet your expectations, we'll refund it.",
      category: "Orders", sortOrder: 5 },
    { question: "How fast do you ship?",
      answer: "Orders placed before 2pm EST ship the same business day. Most orders arrive within 3-5 business days.",
      category: "Orders", sortOrder: 6 },
  ];
  for (const f of faqs) await prisma.fAQ.create({ data: { ...f, isActive: true } });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
