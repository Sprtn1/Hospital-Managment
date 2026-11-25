let configError = "";
let cleanSupabaseUrl = "";

if (!window.APP_CONFIG) {
  configError = "The Supabase configuration is missing.";
} else {
  cleanSupabaseUrl = String(window.APP_CONFIG.supabaseUrl || "").trim().replace(/\/+$/, "");
  const publishableKey = String(window.APP_CONFIG.supabasePublishableKey || "").trim();

  if (!cleanSupabaseUrl || cleanSupabaseUrl.includes("YOUR_PROJECT_REF")) {
    configError = "Open js/config.js and enter your Supabase project URL.";
  } else if (!publishableKey || publishableKey.includes("YOUR_PUBLISHABLE_KEY")) {
    configError = "Open js/config.js and enter your Supabase publishable key.";
  } else {
    try {
      const parsedUrl = new URL(cleanSupabaseUrl);
      if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co") || parsedUrl.pathname !== "/") {
        configError = "The Supabase URL must look like https://your-project-ref.supabase.co with no path after .co.";
      }
    } catch {
      configError = "The Supabase URL is invalid. Copy the Project URL from Supabase Project Settings, then API.";
    }
  }
}

window.configError = configError;
window.configReady = configError === "";
window.dbClient = window.configReady
  ? window.supabase.createClient(
      cleanSupabaseUrl,
      window.APP_CONFIG.supabasePublishableKey.trim(),
      {
        db: { schema: "public" },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  : null;
