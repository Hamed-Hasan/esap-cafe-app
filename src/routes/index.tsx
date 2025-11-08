// Route configuration for tab screens
export const TAB_ROUTES = [
  { name: "index", title: "Home", icon: "home" },
  { name: "chat", title: "Chat", icon: "chatbubbles" },
  { name: "community", title: "Community", icon: "chatbox-ellipses" },
  { name: "profile", title: "Profile", icon: "person" },
] as const;

// Type definitions for better TypeScript support
export type TabRoute = (typeof TAB_ROUTES)[number];
