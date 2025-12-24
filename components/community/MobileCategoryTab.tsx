"use client";

import { Button } from "@/components/ui/button";
import { CATEGORIES, CategoryId } from "@/lib/definitions";

export function MobileCategoryTab({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: typeof CATEGORIES;
  selectedCategory: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <div className="lg:hidden">
      <div className="mb-3 text-sm font-semibold">카테고리</div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
