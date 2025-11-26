import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const pathname = nextUrl.pathname;

      const isAuthPage = pathname === "/login" || pathname === "/signup";
      // const isHomePage = pathname === "/";
      const isDashboard = pathname.startsWith("/dashboard");

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isDashboard) {
        if (!isLoggedIn) {
          return false;
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
