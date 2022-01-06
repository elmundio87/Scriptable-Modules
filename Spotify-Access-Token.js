let input = args.shortcutParameter;

let globals = importModule("Globals");
let spotify = importModule("Spotify");

return await spotify.getAccessToken(
  globals.tenant_id,
  globals.client_id,
  globals.client_secret,
  globals.vault_url
);

Script.complete();
