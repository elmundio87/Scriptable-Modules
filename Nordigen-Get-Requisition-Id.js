let accessToken = args.shortcutParameter;

let institutionsRequest = new Request(
  "https://ob.nordigen.com/api/v2/institutions/?country=gb"
);
institutionsRequest.headers = {
  Accept: "application/json",
  Authorization: "Bearer " + accessToken,
};

institutions = await institutionsRequest.loadJSON();

let findAmexInstitution = (i) => {
  return i.id == "AMERICAN_EXPRESS_AESUGB21";
};

let amex = institutions.filter(findAmexInstitution)[0];

let requisitionRequest = new Request(
  "https://ob.nordigen.com/api/v2/requisitions/"
);
requisitionRequest.method = "POST";

requisitionRequest.headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + accessToken,
};

let requisitionData = {
  redirect: "http://elmund.io/nordigen-redirect",
  institution_id: amex.id,
};

requisitionRequest.body = JSON.stringify(requisitionData);

return await requisitionRequest.loadJSON();

Script.complete();
