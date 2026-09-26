Deno.serve(async () => {
  try {
    const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");
    const username = Deno.env.get("TWITTER_USERNAME");

    if (!bearerToken) {
      throw new Error("TWITTER_BEARER_TOKEN is not configured.");
    }

    if (!username) {
      throw new Error("TWITTER_USERNAME is not configured.");
    }

    // Find the X user by username
    const userResponse = await fetch(
      `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("X user request failed:", userData);

      return Response.json(
        {
          success: false,
          error: "Could not retrieve X/Twitter user information.",
        },
        { status: 400 }
      );
    }

    const user = userData.data;

    if (!user) {
      return Response.json(
        {
          success: false,
          error: "X/Twitter user was not found.",
        },
        { status: 404 }
      );
    }

    const followers =
      user.public_metrics?.followers_count ?? 0;

    return Response.json({
      success: true,
      username: user.username,
      followers,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("getTwitterFollowers error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
});
