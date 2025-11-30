"use client";

import React, { useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDownRef.current = true;
    setIsDragging(true);
    el.classList.add("select-none");
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollTop;
  };

  const onMouseLeave = () => {
    isDownRef.current = false;
    setIsDragging(false);
    containerRef.current?.classList.remove("select-none");
  };

  const onMouseUp = () => {
    isDownRef.current = false;
    setIsDragging(false);
    containerRef.current?.classList.remove("select-none");
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el || !isDownRef.current) return;
    // vertical drag to scroll
    e.preventDefault();
    const y = e.pageY - el.offsetTop;
    const walk = (y - startXRef.current) * 1; // multiplier for speed
    el.scrollTop = scrollLeftRef.current - walk;
  };

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">카테고리</CardTitle>
          <CardDescription>보고 싶은 게시판을 선택해 보세요.</CardDescription>
        </CardHeader>
        {/*
          containerRef wraps the scrollable area. We use overflow-auto so it can scroll
          and add mouse drag handlers to allow click-and-drag scrolling with the mouse.
        */}
        <CardContent className="p-0">
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={`space-y-1 max-h-[70vh] overflow-auto py-3 px-3 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
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
