import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

function hexToHslChannels(hex) {
  if (!hex || !hex.startsWith("#")) return null;
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function usePlannerTheme() {
  const [custom, setCustom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await base44.entities.UserCustomization.list();
        if (!cancelled && data && data.length > 0) setCustom(data[0]);
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const themeStyle = {};
  if (custom) {
    const vars = {};
    if (custom.primaryColor) vars["--primary"] = hexToHslChannels(custom.primaryColor);
    if (custom.secondaryColor) vars["--secondary"] = hexToHslChannels(custom.secondaryColor);
    if (custom.accentColor) vars["--accent"] = hexToHslChannels(custom.accentColor);
    if (custom.backgroundColor) vars["--background"] = hexToHslChannels(custom.backgroundColor);
    if (custom.textColor) vars["--foreground"] = hexToHslChannels(custom.textColor);
    if (custom.font) vars["--font-body"] = custom.font;
    Object.assign(themeStyle, vars);
  }
  if (custom?.theme === "dark") themeStyle["color-scheme"] = "dark";

  return { custom, loading, themeStyle, dark: custom?.theme === "dark" };
}