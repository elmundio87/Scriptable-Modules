function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ISODateString(d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    ":" +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function offsetDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports.penceToGBP = (amount) => {
  return (amount / 100).toFixed(2);
};

module.exports.getAccessToken = async (
  tenant_id,
  client_id,
  client_secret,
  vault_url
) => {
  const oauthUrl =
    "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token";

  const oauthUrlBody = {
    grant_type: "client_credentials",
    client_id: client_id,
    client_secret: client_secret,
    resource: "https://vault.azure.net",
  };

  var oauthRequest = new Request(oauthUrl);
  oauthRequest.method = "POST";
  oauthRequest.headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  oauthRequest.addParameterToMultipart("grant_type", "client_credentials");
  oauthRequest.addParameterToMultipart("client_id", client_id);
  oauthRequest.addParameterToMultipart("client_secret", client_secret);
  oauthRequest.addParameterToMultipart("resource", "https://vault.azure.net");

  let vault_access_token = (await oauthRequest.loadJSON()).access_token;

  const vaultUrl = vault_url + "secrets/monzo-auth-token?api-version=7.2";
  const vaultHeaders = {
    Authorization: "Bearer " + vault_access_token,
  };

  let vaultRequest = new Request(vaultUrl);
  vaultRequest.headers = vaultHeaders;
  let vaultBody = await vaultRequest.loadJSON();

  return vaultBody.value;
};

module.exports.getPots = async (account_id, access_token) => {
  let url = "https://api.monzo.com/pots?current_account_id=" + account_id;

  console.log(url);
  let headers = {
    Authorization: "Bearer " + access_token,
  };

  let r = new Request(url);
  r.headers = headers;

  let pots = (await r.loadJSON()).pots;

  console.log(pots);

  var output = {};

  var each = (pot) => {
    if (!pot["deleted"]) {
      output[pot["name"]] = pot;
    }
  };

  pots.forEach(each);

  return output;
};

module.exports.getAccountBalance = async (account_id, access_token) => {
  let url = "https://api.monzo.com/balance?account_id=" + account_id;
  let headers = {
    Authorization: "Bearer " + access_token,
  };

  let r = new Request(url);
  r.headers = headers;

  let balance = (await r.loadJSON()).balance;

  return balance;
};

module.exports.withdrawFromPot = async (
  account_id,
  access_token,
  pot_id,
  amount
) => {
  let url = "https://api.monzo.com/pots/" + pot_id + "/withdraw";
  let headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let form = {
    destination_account_id: account_id,
    amount: amount.toString(),
    dedupe_id: getRandomInt(11111, 99999).toString(),
  };

  var formBody = [];
  for (var property in form) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  var r = new Request(url);
  r.method = "PUT";
  r.body = formBody;
  r.headers = headers;

  result = await r.loadJSON();

  console.log(result);

  return result;
};

module.exports.depositIntoPot = async (
  account_id,
  access_token,
  pot_id,
  amount
) => {
  let url = "https://api.monzo.com/pots/" + pot_id + "/deposit";
  let headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let form = {
    source_account_id: account_id,
    amount: amount.toString(),
    dedupe_id: getRandomInt(11111, 99999).toString(),
  };

  var formBody = [];
  for (var property in form) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  var r = new Request(url);
  r.method = "PUT";
  r.body = formBody;
  r.headers = headers;

  result = await r.loadJSON();

  return result;
};

module.exports.addTransactionNote = async (
  account_id,
  access_token,
  transaction_id,
  note
) => {
  let url = "https://api.monzo.com/transactions/" + transaction_id;
  let headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let form = {
    "metadata[notes]": note,
  };

  var formBody = [];
  for (var property in form) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  var r = new Request(url);
  r.method = "PATCH";
  r.body = formBody;
  r.headers = headers;

  result = await r.loadJSON();

  return result;
};

module.exports.getTransactionId = async (
  account_id,
  access_token,
  amount,
  since
) => {
  let today = new Date();
  let startDate = offsetDays(today, -since);
  let url =
    "https://api.monzo.com/transactions?account_id=" +
    account_id +
    "&since=" +
    startDate.toISOString() +
    "&before=" +
    today.toISOString();

  let headers = {
    Authorization: "Bearer " + access_token,
  };

  let r = new Request(url);
  r.headers = headers;

  transactions = (await r.loadJSON()).transactions;

  if (amount != 0) {
    const results = transactions.filter(
      (transaction) => transaction.amount == amount
    );
    if (results.length > 0) {
      return results.pop().id;
    } else {
      return "";
    }
  } else {
    return transactions.pop().id;
  }
};

module.exports.listTransactions = async (account_id, access_token, days) => {
  let today = new Date();
  let startDate = offsetDays(today, -days);

  let url =
    "https://api.monzo.com/transactions?account_id=" +
    account_id +
    "&since=" +
    startDate.toISOString() +
    "&before=" +
    today.toISOString();

  let headers = {
    Authorization: "Bearer " + access_token,
  };

  let r = new Request(url);
  r.headers = headers;

  return (await r.loadJSON()).transactions;
};
