let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

if (!input) {
  input = {};
}

if (!("account_id" in input)) {
  throw "Missing param: account_id";
}

if (!("days" in input)) {
  throw "Missing param: days";
}

token = input.token;

if (!token) {
  token = await monzo.getAccessToken(
    globals.tenant_id,
    globals.client_id,
    globals.client_secret,
    globals.vault_url
  );
}

return await monzo.listTransactions(input.account_id, token, input.days);

Script.complete();
