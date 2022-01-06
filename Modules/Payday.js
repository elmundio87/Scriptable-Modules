const payDayForMonth = (day, month, year) => {
  var payday = new Date(year, month, day);
  var offset = 0;
  if (payday.getDay() === 0) {
    offset = 2;
  }
  if (payday.getDay() === 6) {
    offset = 1;
  }
  payday = new Date(payday.setDate(payday.getDate() - offset));
  return payday;
};

module.exports.payDayForMonth = payDayForMonth;

const input = 21;

var today = new Date();

var payday = payDayForMonth(input, today.getMonth(), today.getFullYear());
if (today > payday) {
  today = new Date(today.setMonth(today.getMonth() + 1));
  payday = payDayForMonth(input, today.getMonth(), today.getFullYear());
}

return payday.toISOString();

Script.complete();
