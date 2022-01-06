let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

return await monzo.getAccessToken(
  globals.tenant_id,
  globals.client_id,
  globals.client_secret,
  globals.vault_url
);

Script.complete();
