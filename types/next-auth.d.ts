import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "main_director" | "sub_director";
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: "admin" | "main_director" | "sub_director";
  }
}
