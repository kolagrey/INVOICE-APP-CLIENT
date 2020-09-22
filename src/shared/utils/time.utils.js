const moment = require('moment');
const present = {
  minute: moment().format('m'),
  hour: moment().format('H'),
  day: moment().format('D'),
  dayOfWeek: moment().format('dddd'),
  month: moment().format('MMMM'),
  year: moment().format('YYYY')
};

module.exports = {
  present,
  moment
};
