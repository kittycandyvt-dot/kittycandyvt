import { useEffect, useState } from "react";

export default function TwitterFollowerCount() {
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowers = async () => {
    try {
      const response = await fetch(
        "/api/functions/getTwitterFollowers"
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
      console.error("Failed to load X followers:", error);
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
      href="https://x.com/KittyCandy_VT"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3"
    >
      <div className="text-center">
        <div className="font-semibold text-white">
          X / Twitter
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
