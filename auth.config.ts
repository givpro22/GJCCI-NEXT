import type { NextAuthConfig } from "next-auth";
import { matchRoute } from "./utils/auth.utils";
import { routeRules } from "./constants/routes";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      if (matchRoute(pathname, routeRules.guestOnly)) {
        return isLoggedIn ? Response.redirect(new URL("/", nextUrl)) : true;
      }

      if (matchRoute(pathname, routeRules.authOnly)) {
        return isLoggedIn;
      }

      if (matchRoute(pathname, routeRules.adminOnly)) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
