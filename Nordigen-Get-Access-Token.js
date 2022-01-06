let input = args.shortcutParameter;

let auth_data = {
  secret_id: input.secret_id,
  secret_key: input.secret_key,
};

let authRequest = new Request("https://ob.nordigen.com/api/v2/token/new/");
authRequest.method = "POST";
authRequest.headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
authRequest.body = JSON.stringify(auth_data);

authResponse = await authRequest.loadJSON();

return authResponse.access;

Script.complete();
