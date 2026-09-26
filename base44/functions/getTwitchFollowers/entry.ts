import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get the saved Twitch authorization
    const authRecords = await base44.entities.TwitchAuth.list();

    if (!authRecords || authRecords.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Twitch is not connected yet.",
        },
        { status: 400 }
      );
    }

    const auth = authRecords[0];

    let accessToken = auth.access_token;

    // Refresh the token if it has expired
    if (Date.now() >= auth.expires_at) {
      const clientId = Deno.env.get("TWITCH_CLIENT_ID");
      const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");

      if (!clientId || !clientSecret) {
        throw new Error("Twitch credentials are not configured.");
      }

      const refreshResponse = await fetch(
        "https://id.twitch.tv/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "refresh_token",
            refresh_token: auth.refresh_token,
          }),
        }
      );

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        console.error("Twitch token refresh failed:", refreshData);

        return Response.json(
          {
            success: false,
            error: "Twitch authorization needs to be reconnected.",
          },
          { status: 401 }
        );
      }

      accessToken = refreshData.access_token;

      await base44.entities.TwitchAuth.update(auth.id, {
        access_token: refreshData.access_token,
        refresh_token:
          refreshData.refresh_token || auth.refresh_token,
        expires_at:
          Date.now() + refreshData.expires_in * 1000,
      });
    }

    // Get the Twitch user ID
    const userId = auth.twitch_user_id;

    // Get follower count
    const followersResponse = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${encodeURIComponent(
        userId
      )}`,
      {
        headers: {
          "Client-ID": Deno.env.get("TWITCH_CLIENT_ID")!,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const followersData = await followersResponse.json();

    if (!followersResponse.ok) {
      console.error(
        "Twitch followers request failed:",
        followersData
      );

      return Response.json(
        {
          success: false,
          error: "Could not retrieve Twitch followers.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      username: auth.twitch_username,
      followers: followersData.total,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("getTwitchFollowers error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Unknown error",
      },
      { status: 500 }
    );
  }
});
