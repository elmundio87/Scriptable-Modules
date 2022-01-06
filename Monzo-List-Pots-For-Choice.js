let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

if (!input) {
  input = {};
}

if (!("account_id" in input)) {
  throw "Missing param: account_id";
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

pots = input.pots;

if (!pots) {
  pots = await monzo.getPots(input.account_id, token);
}

var output = {};

var each = (key) => {
  pot = pots[key];
  pot_name = pot["name"];

  gbp_balance = "£" + (pot["balance"] / 100).toFixed(2);
  output[`${pot_name} (${gbp_balance})`] = pot;
};

Object.keys(pots).sort().forEach(each);

return output;

Script.complete();
