const url = args.shortcutParameter;

login_data = {
  method: "auth.login",
  params: ["deluge"],
  id: 1,
};

headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

let r = new Request(url);
r.method = "POST";
r.headers = headers;
r.body = JSON.stringify(login_data);
let body = await r.loadJSON();

return r.response.cookies[0].value;

Script.complete();
