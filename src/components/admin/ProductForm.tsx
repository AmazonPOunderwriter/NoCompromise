// src/components/admin/ProductForm.tsx
"use client";
import { useState, useTransition } from "react";
import { saveProduct } from "@/server/admin/product-actions";
import { evaluateCompliance } from "@/server/compliance/engine";
import type { Brand, Category, Product, ProductImage } from "@prisma/client";
import { AlertTriangle, Check, X } from "lucide-react";

type EditProduct = (Product & {
  images: ProductImage[];
  categories: { categoryId: string }[];
}) | undefined;

export function ProductForm({
  brands,
  categories,
  product,
}: {
  brands: Brand[];
  categories: Category[];
  product?: EditProduct;
}) {
  const [pending, start] = useTransition();
  const [rawIngredients, setRawIngredients] = useState(
    product?.rawIngredientsText ?? "",
  );

  const preview = rawIngredients ? evaluateCompliance(rawIngredients) : null;

  return (
    <form
      action={(fd) =>
        start(() =>
          saveProduct({
            id: product?.id,
            title: String(fd.get("title")),
            slug: String(fd.get("slug")),
            subtitle: String(fd.get("subtitle") ?? ""),
            description: String(fd.get("description")),
            whyItPassed: String(fd.get("whyItPassed") ?? ""),
            brandId: String(fd.get("brandId")),
            priceCents: Math.round(Number(fd.get("price")) * 100),
            inventoryQty: Number(fd.get("inventoryQty") ?? 0),
            rawIngredientsText: rawIngredients,
            categoryIds: fd.getAll("categoryIds").map(String),
            imageUrl: String(fd.get("imageUrl") ?? ""),
            isFeatured: fd.get("isFeatured") === "on",
            isStaffPick: fd.get("isStaffPick") === "on",
          }),
        )
      }
      className="space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={product?.title} required />
        <Field label="URL slug" name="slug" defaultValue={product?.slug} required />
      </div>
      <Field
        label="Subtitle"
        name="subtitle"
        defaultValue={product?.subtitle ?? ""}
      />
      <Textarea
        label="Description"
        name="description"
        rows={4}
        defaultValue={product?.description}
        required
      />
      <Textarea
        label="Why it passed our standard"
        name="whyItPassed"
        rows={3}
        defaultValue={product?.whyItPassed ?? ""}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Brand
          </span>
          <select
            name="brandId"
            defaultValue={product?.brandId}
            required
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
          >
            <option value="">Select a brand…</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""}
          required
        />
        <Field
          label="Inventory"
          name="inventoryQty"
          type="number"
          defaultValue={product?.inventoryQty ?? 0}
        />
      </div>

      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Categories
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const checked = product?.categories.some((pc) => pc.categoryId === c.id);
            return (
              <label
                key={c.id}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary"
              >
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={c.id}
                  defaultChecked={checked}
                  className="accent-primary"
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </div>

      <Field
        label="Image URL"
        name="imageUrl"
        defaultValue={product?.images[0]?.url ?? ""}
      />

      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Ingredient list (free-form label text)
        </span>
        <textarea
          value={rawIngredients}
          onChange={(e) => setRawIngredients(e.target.value)}
          rows={3}
          placeholder="e.g., Organic olive oil, sea salt, garlic, natural flavors"
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {preview && (
        <div
          className={`rounded-xl border p-5 ${
            preview.result === "PASS"
              ? "border-primary/30 bg-primary/5"
              : preview.result === "FAIL"
                ? "border-destructive/30 bg-destructive/5"
                : "border-amber-300 bg-amber-50"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {preview.result === "PASS" ? (
              <Check className="h-4 w-4 text-primary" />
            ) : preview.result === "FAIL" ? (
              <X className="h-4 w-4 text-destructive" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-700" />
            )}
            Live verdict: {preview.result.replace("_", " ")}
          </div>
          <p className="text-sm mt-2">{preview.summary}</p>
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured}
            className="accent-primary"
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isStaffPick"
            defaultChecked={product?.isStaffPick}
            className="accent-primary"
          />
          Staff pick
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", defaultValue, required, step,
}: {
  label: string; name: string; type?: string; defaultValue?: string | number;
  required?: boolean; step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        name={name}
        step={step}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function Textarea({
  label, name, rows, defaultValue, required,
}: {
  label: string; name: string; rows?: number; defaultValue?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
