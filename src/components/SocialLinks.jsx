import React from "react";
import {
  Twitch,
  Youtube,
  Music2,
  Instagram,
  Twitter,
  Cloud,
  MessageCircle,
  Coffee,
  Crown,
  Heart,
} from "lucide-react";
import { socials } from "@/data/siteData";

const iconMap = {
  Twitch,
  Youtube,
  Music2,
  Instagram,
  Twitter,
  Cloud,
  MessageCircle,
  Coffee,
  Crown,
};

export default function SocialLinks({ size = 18, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socials.map((s) => {
        const Icon = iconMap[s.icon] || Heart;
        return (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="grid place-items-center w-10 h-10 rounded-full bg-white/70 border border-pink-100 text-pink-500 hover:bg-pink-500 hover:text-white hover:scale-110 transition-all duration-200 shadow-sm"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}