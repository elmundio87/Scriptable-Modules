const globals = importModule("Globals");
const payday = importModule("Payday");
const monzo = importModule("Monzo");

const daysBetweenDates = (date1, date2) => {
  var time_difference = date2.getTime() - date1.getTime();
  return time_difference / (1000 * 60 * 60 * 24);
};

const input = 21;

var today = new Date();

let pd = payday.payDayForMonth(input, today.getMonth(), today.getFullYear());
if (daysBetweenDates(today, pd) < 0) {
  today = new Date(today.setMonth(today.getMonth() + 1));
  pd = payday.payDayForMonth(input, today.getMonth(), today.getFullYear());
}

let token = await monzo.getAccessToken(
  globals.tenant_id,
  globals.client_id,
  globals.client_secret,
  globals.vault_url
);

let balance = await monzo.getAccountBalance(globals.accounts.Joint, token);

let days = Math.ceil(daysBetweenDates(new Date(), pd));

if (days === 0) {
  return "Payday is today!";
}

if (days >= 1) {
  let avgBalance = balance / days;
  return (
    "There are " +
    days +
    " days left until your next payday. You have £" +
    monzo.penceToGBP(balance) +
    " left to spend from the joint account (average £" +
    monzo.penceToGBP(avgBalance) +
    ")."
  );
} else {
  return (
    "You will be paid tomorrow morning. You have £" +
    monzo.penceToGBP(balance) +
    " left to spend."
  );
}

Script.complete();
