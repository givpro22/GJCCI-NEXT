import { CATEGORIES as DEFAULT_CATEGORIES } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CategorySidebar({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onSelect,
}: {
  categories?: { id: string; label: string }[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">카테고리</CardTitle>
          <CardDescription>보고 싶은 게시판을 선택해 보세요.</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className={`space-y-1 max-h-[70vh] overflow-auto py-3 px-3`}>
            {categories.map((category) => (
              <div key={category.id} className="mb-1">
                <Button
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onSelect(category.id)}
                >
                  {category.label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
