import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Menu } from "lucide-react";
import { Button, Sheet, SheetContent, SheetTrigger } from "../ui";
import { ROUTES } from "@/constants/routes";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-100">
      <div className=" flex h-16 items-center justify-between px-20 ">
        <Link href={ROUTES.HOME}>
          <img src="/favicon.png" alt="Logo" className="h-8" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden  md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button asChild>
                    <Link href={ROUTES.LOGIN} className="px-4 py-2">
                      로그인
                    </Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/blog" className="px-4 py-2">
                    시험일정
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className="px-4 py-2">
                    커뮤니티
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col space-y-4 mt-6 text-lg">
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
