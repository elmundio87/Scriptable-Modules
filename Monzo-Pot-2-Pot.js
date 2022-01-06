let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

if (!input) {
  throw "No input dictionary passed in";
}

if (!("pot_id_source" in input)) {
  throw "Missing param: pot_id_source";
}

if (!("pot_id_destination" in input)) {
  throw "Missing param: pot_id_destination";
}

if (!("account_id" in input)) {
  throw "Missing param: account_id";
}

if (!("amount_source" in input)) {
  throw "Missing param: amount_source";
}

if (!("amount_destination" in input)) {
  throw "Missing param: amount_destination";
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

if (input.amount_destination > 0) {
  await monzo.withdrawFromPot(
    input.account_id,
    token,
    input.pot_id_source,
    input.amount_source
  );
  await monzo.depositIntoPot(
    input.account_id,
    token,
    input.pot_id_destination,
    input.amount_destination
  );
} else {
  throw "Amount must be greater than 0";
}

Script.complete();
