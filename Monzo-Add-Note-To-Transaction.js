let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

if (!input) {
  throw "No input dictionary passed in";
}

if (!("account_id" in input)) {
  throw "Missing param: account_id";
}

if (!("amount" in input)) {
  throw "Missing param: amount";
}

if (!("since" in input)) {
  throw "Missing param: since";
}

if (!("note" in input)) {
  throw "Missing param: note";
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

let transaction_id = await monzo.getTransactionId(
  input.account_id,
  token,
  input.amount,
  input.since
);

Script.complete();
