// Centralized white-label configuration for the VTuber Planner product.
// Change these values to rebrand the planner — nothing in the app is hard-coded.

export const plannerConfig = {
  productName: "VTuber Planner",
  brandName: "KittyCandyVT",
  tagline: "Your VTuber Life, Organized.",
  description:
    "A customizable planner built specifically for VTubers and content creators.",
  logo: "",
  favicon: "",
  websiteUrl: "https://kittycandyvt.ca",
  plannerUrl: "https://kittycandyvt.ca/planner",
  kofiUrl: "https://ko-fi.com/yourshop/vtuber-planner",
  supportUrl: "https://kittycandyvt.ca/contact",
  socials: {
    twitch: "https://twitch.tv/kittycandyvt",
    youtube: "https://youtube.com/@kittycandyvt",
    tiktok: "https://tiktok.com/@kittycandyvt",
    instagram: "https://instagram.com/kittycandyvt",
    x: "https://x.com/kittycandyvt",
    discord: "",
  },
  defaultColors: {
    primary: "#e64a85",
    secondary: "#d946ef",
    accent: "#a855f7",
    background: "#ffe0ef",
    text: "#25161c",
  },
  defaultTheme: "light",
  kofiVerificationToken: "", // set in dashboard secrets as KOFI_VERIFICATION_TOKEN
};