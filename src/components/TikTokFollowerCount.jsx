import { useEffect, useState } from "react";

export default function TikTokFollowerCount() {
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowers = async () => {
    try {
      const response = await fetch(
        "/api/functions/getTikTokFollowers"
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && typeof data.followers === "number") {
        setFollowers(data.followers);
      } else {
        throw new Error("Invalid follower response");
      }
    } catch (error) {
      console.error("Failed to load TikTok followers:", error);
      setFollowers(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowers();

    const interval = setInterval(getFollowers, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="https://www.tiktok.com/@kittycandyvt"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3"
    >
      <div className="text-center">
        <div className="font-semibold text-white">
          TikTok
        </div>

        <div className="text-sm text-white opacity-80">
          {loading
            ? "Loading..."
            : followers !== null
              ? `${followers.toLocaleString()} followers`
              : "Followers unavailable"}
        </div>
      </div>
    </a>
  );
}
