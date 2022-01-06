let input = args.shortcutParameter;

let globals = importModule("Globals");
let monzo = importModule("Monzo");

if (!input) {
  throw "No input dictionary passed in";
}

if (!("pot_id" in input)) {
  throw "Missing param: pot_id";
}

if (!("account_id" in input)) {
  throw "Missing param: account_id";
}

if (!("amount" in input)) {
  throw "Missing param: amount";
}

if (!("action" in input)) {
  throw "Missing param: action";
}

token = input.token;

switch (input.action) {
  case "withdraw":
    return await monzo.withdrawFromPot(
      input.account_id,
      token,
      input.pot_id,
      input.amount
    );
    break;
  case "deposit":
    return await monzo.depositIntoPot(
      input.account_id,
      token,
      input.pot_id,
      input.amount
    );
    break;
  default:
    throw "Invalid action: " + input.action;
}

Script.complete();
