import { useEffect, useState } from "react";

export default function TwitchFollowerCount() {
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowers = async () => {
    try {
      const response = await fetch(
        "/api/functions/getTwitchFollowers"
      );

      const data = await response.json();

      if (data.success) {
        setFollowers(data.followers);
      }
    } catch (error) {
      console.error("Failed to load Twitch followers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowers();

    // Update every minute
    const interval = setInterval(getFollowers, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="https://www.twitch.tv/kittycandyvt"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3"
    >
     <div>
  <div className="font-semibold text-white">
    Twitch
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
