"use client";
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
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { data: session } = useSession();
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
              {session?.user?.role === "admin" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href={ROUTES.ADMIN} className="px-4 py-2">
                      관리자
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={ROUTES.SCHEDULER} className="px-4 py-2">
                    시험일정
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={ROUTES.COMMUNITY} className="px-4 py-2">
                    커뮤니티
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.user?.image ?? ""}
                            alt={session.user?.name ?? "프로필"}
                          />
                          <AvatarFallback>
                            {session.user?.name?.charAt(0) ??
                              session.user?.email?.charAt(0) ??
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block max-w-[140px] truncate text-sm">
                          {session.user?.name ??
                            session.user?.email ??
                            "마이 프로필"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel className="flex flex-col">
                        <span className="font-medium">
                          {session.user?.name ?? "회원"}
                        </span>
                        {session.user?.email && (
                          <span className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                          </span>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.MY_PROFILE}>마이 프로필</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="text-red-500 focus:text-red-500"
                      >
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <NavigationMenuLink asChild>
                    <Button asChild>
                      <Link href={ROUTES.LOGIN} className="px-4 py-2">
                        로그인
                      </Link>
                    </Button>
                  </NavigationMenuLink>
                )}
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
              <Link href={ROUTES.SCHEDULER}>시험일정</Link>
              <Link href={ROUTES.COMMUNITY}>커뮤니티</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
