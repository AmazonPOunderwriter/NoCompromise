// src/server/compliance/rules.ts
// Canonical ingredient standards. The single source of truth for screening.

export type RuleSeverity = "BANNED" | "CAUTION";

export interface IngredientRule {
  key: string;             // canonical key
  displayName: string;
  severity: RuleSeverity;
  aliases: string[];       // substrings matched case-insensitively against label text
  rationale: string;
}

export const BANNED_INGREDIENTS: IngredientRule[] = [
  {
    key: "canola_oil",
    displayName: "Canola Oil",
    severity: "BANNED",
    aliases: ["canola oil", "rapeseed oil", "low erucic acid rapeseed"],
    rationale:
      "Industrial seed oil, high in oxidized linoleic acid, typically hexane-extracted.",
  },
  {
    key: "soybean_oil",
    displayName: "Soybean Oil",
    severity: "BANNED",
    aliases: ["soybean oil", "soya oil", "vegetable oil (soy)"],
    rationale: "Inflammatory seed oil, dominant source of industrial omega-6.",
  },
  {
    key: "sunflower_oil",
    displayName: "Sunflower Oil",
    severity: "BANNED",
    aliases: ["sunflower oil", "refined sunflower oil"],
    rationale: "High-linoleic industrial seed oil.",
  },
  {
    key: "safflower_oil",
    displayName: "Safflower Oil",
    severity: "BANNED",
    aliases: ["safflower oil"],
    rationale: "Industrial seed oil.",
  },
  {
    key: "corn_oil",
    displayName: "Corn Oil",
    severity: "BANNED",
    aliases: ["corn oil", "maize oil"],
    rationale: "Industrial seed oil, highly processed.",
  },
  {
    key: "grapeseed_oil",
    displayName: "Grapeseed Oil",
    severity: "BANNED",
    aliases: ["grapeseed oil", "grape seed oil"],
    rationale: "Industrial seed oil byproduct, unstable at heat.",
  },
  {
    key: "cottonseed_oil",
    displayName: "Cottonseed Oil",
    severity: "BANNED",
    aliases: ["cottonseed oil"],
    rationale: "Industrial seed oil, cotton is a non-food crop with heavy pesticide load.",
  },
  {
    key: "rice_bran_oil",
    displayName: "Rice Bran Oil",
    severity: "BANNED",
    aliases: ["rice bran oil"],
    rationale: "Industrial seed oil.",
  },
  {
    key: "palm_olein",
    displayName: "Palm Olein",
    severity: "BANNED",
    aliases: ["palm olein", "refined palm olein"],
    rationale: "Highly processed palm fraction, distinct from whole red palm oil.",
  },
  {
    key: "artificial_flavors",
    displayName: "Artificial Flavors",
    severity: "BANNED",
    aliases: ["artificial flavor", "artificial flavour", "artificial flavors"],
    rationale: "Undisclosed synthetic chemistry.",
  },
  {
    key: "artificial_colors",
    displayName: "Artificial Colors",
    severity: "BANNED",
    aliases: [
      "artificial color",
      "artificial colour",
      "red 40",
      "red #40",
      "yellow 5",
      "yellow #5",
      "yellow 6",
      "blue 1",
      "blue #1",
      "fd&c",
    ],
    rationale: "Petroleum-derived synthetic dyes.",
  },
  {
    key: "hfcs",
    displayName: "High Fructose Corn Syrup",
    severity: "BANNED",
    aliases: ["high fructose corn syrup", "hfcs", "glucose-fructose syrup"],
    rationale: "Industrial sweetener linked to metabolic dysfunction.",
  },
  {
    key: "bha_bht",
    displayName: "BHA / BHT",
    severity: "BANNED",
    aliases: ["bha", "bht", "butylated hydroxyanisole", "butylated hydroxytoluene"],
    rationale: "Synthetic preservatives with health concerns.",
  },
  {
    key: "tbhq",
    displayName: "TBHQ",
    severity: "BANNED",
    aliases: ["tbhq", "tert-butylhydroquinone"],
    rationale: "Petroleum-derived preservative.",
  },
  {
    key: "sodium_benzoate",
    displayName: "Sodium Benzoate",
    severity: "BANNED",
    aliases: ["sodium benzoate"],
    rationale: "Synthetic preservative, forms benzene with ascorbic acid.",
  },
];

export const CAUTION_INGREDIENTS: IngredientRule[] = [
  {
    key: "natural_flavors",
    displayName: "Natural Flavors",
    severity: "CAUTION",
    aliases: ["natural flavor", "natural flavour", "natural flavors"],
    rationale: "Undisclosed mixture — requires brand clarification.",
  },
  {
    key: "gums",
    displayName: "Gums",
    severity: "CAUTION",
    aliases: ["xanthan gum", "guar gum", "gellan gum", "gum arabic"],
    rationale: "Context-dependent; generally avoided in minimal-ingredient products.",
  },
  {
    key: "maltodextrin",
    displayName: "Maltodextrin",
    severity: "CAUTION",
    aliases: ["maltodextrin"],
    rationale: "Highly processed filler, spikes blood glucose.",
  },
  {
    key: "carrageenan",
    displayName: "Carrageenan",
    severity: "CAUTION",
    aliases: ["carrageenan"],
    rationale: "Seaweed-derived emulsifier with inflammation concerns.",
  },
  {
    key: "lecithin",
    displayName: "Lecithin",
    severity: "CAUTION",
    aliases: ["soy lecithin", "sunflower lecithin", "lecithin"],
    rationale: "Emulsifier — soy versions typically rejected, sunflower reviewed.",
  },
  {
    key: "dextrose",
    displayName: "Dextrose",
    severity: "CAUTION",
    aliases: ["dextrose"],
    rationale: "Added sugar in disguise.",
  },
  {
    key: "generic_spices",
    displayName: "Unspecified 'Spices'",
    severity: "CAUTION",
    aliases: ["spices", "spice blend"],
    rationale: "Lacks ingredient-level transparency.",
  },
  {
    key: "emulsifiers",
    displayName: "Synthetic Emulsifiers",
    severity: "CAUTION",
    aliases: ["polysorbate", "mono and diglycerides", "mono- and diglycerides"],
    rationale: "Gut microbiome concerns.",
  },
];

export const ALL_RULES: IngredientRule[] = [
  ...BANNED_INGREDIENTS,
  ...CAUTION_INGREDIENTS,
];
