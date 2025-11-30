// src/constants/routes.ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  COMMUNITY: "/community",
  SCHEDULER: "/exam-schedule",
  POST: {
    ROOT: "/posts",
    DETAIL: (id: string | number) => `/posts/${id}`,
    EDIT: (id: string | number) => `/posts/${id}/edit`,
  },

  USER: {
    ROOT: "/users",
    DETAIL: (id: string | number) => `/users/${id}`,
  },
} as const;
