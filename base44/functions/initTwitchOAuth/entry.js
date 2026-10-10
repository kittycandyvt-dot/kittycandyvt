import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require admin auth — only the owner should initiate the Twitch OAuth flow
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Admin authentication required to connect Twitch." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get("TWITCH_CLIENT_ID");
    const redirectUri = Deno.env.get("TWITCH_REDIRECT_URI");

    if (!clientId) {
      throw new Error("TWITCH_CLIENT_ID is not configured.");
    }
    if (!redirectUri) {
      throw new Error("TWITCH_REDIRECT_URI is not configured.");
    }

    // Generate a cryptographically random state value for CSRF protection
    const state = crypto.randomUUID();
    const scopes = "user:read:followers";
    const authorizeUrl =
      `https://id.twitch.tv/oauth2/authorize`
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&response_type=code`
      + `&scope=${encodeURIComponent(scopes)}`
      + `&state=${encodeURIComponent(state)}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: authorizeUrl,
        "Set-Cookie":
          `twitch_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("initTwitchOAuth error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});