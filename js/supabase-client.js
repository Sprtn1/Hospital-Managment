const configReady =
  window.APP_CONFIG &&
  !window.APP_CONFIG.supabaseUrl.includes("YOUR_PROJECT_REF") &&
  !window.APP_CONFIG.supabasePublishableKey.includes("YOUR_PUBLISHABLE_KEY");

window.configReady = configReady;
window.dbClient = configReady
  ? window.supabase.createClient(
      window.APP_CONFIG.supabaseUrl,
      window.APP_CONFIG.supabasePublishableKey,
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
