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

  const vaultUrl = vault_url + "secrets/spotify-auth-token?api-version=7.2";
  const vaultHeaders = {
    Authorization: "Bearer " + vault_access_token,
  };

  let vaultRequest = new Request(vaultUrl);
  vaultRequest.headers = vaultHeaders;
  let vaultBody = await vaultRequest.loadJSON();

  return vaultBody.value;
};

module.exports.getUrlId = (url) => {
  return url.split("/")[4].split("?")[0];
};

module.exports.getUrlMethod = (url) => {
  return url.split("/")[3];
};

module.exports.getAlbum = async (id, token) => {
  let get = new Request("https://api.spotify.com/v1/albums/" + id);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  get.headers = headers;
  return await get.loadJSON();
};

module.exports.getTrack = async (id, token) => {
  let get = new Request("https://api.spotify.com/v1/tracks/" + id);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  get.headers = headers;
  return await get.loadJSON();
};
