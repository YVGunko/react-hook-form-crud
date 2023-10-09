import dayjs from 'dayjs';

const en = require('dayjs/locale/en');
const ru = require('dayjs/locale/ru');
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
const weekday = require('dayjs/plugin/weekday');
dayjs.Ls.en.weekStart = 1;
dayjs.Ls.ru.weekStart = 1;

const defaultListFormValues = {
  isUser: true,
  defaultDates: '3',
};
export { defaultListFormValues };

/* const defaultDates = [
  { value: '0', label: 'Сегодня' },
  { value: '2', label: 'Эта неделя' },
  { value: '3', label: 'Этот месяц' },
  { value: '6', label: 'Этот год' },
];
export { defaultDates };*/

function getToday() {
  const from = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  return {
    from,
    to,
  };
}
export { getToday };

function getYesterday() {
  const from = dayjs().startOf('day').subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('day').subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');

  return {
    from,
    to,
  };
}
export { getYesterday };

function getWeek() {
  const from = dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss');
  return {
    from,
    to,
  };
}
export { getWeek };

function getLastWeek() {
  const from = dayjs().startOf('week').subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('week').subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss');
  return {
    from,
    to,
  };
}
export { getLastWeek };

function getYear() {
  const from = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss');
  return {
    from,
    to,
  };
}
export { getYear };

function getQuarter() {
  dayjs.extend(quarterOfYear);
  const from = dayjs().startOf('Q').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('Q').format('YYYY-MM-DD HH:mm:ss');
  return {
    from,
    to,
  };
}
export { getQuarter };

function getLastQuarter() {
  dayjs.extend(quarterOfYear);
  const from = dayjs().startOf('Q').subtract(1, 'Q').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('Q').subtract(1, 'Q').format('YYYY-MM-DD HH:mm:ss');
  return {
    from,
    to,
  };
}
export { getLastQuarter };

function getMonth() {
  const from = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
  /*const dateToday = new Date();
  const from = dayjs(new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)).format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs(new Date(dateToday.getFullYear(), dateToday.getMonth() + 1, 0, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
  */
  return {
    from,
    to,
  };
}
export { getMonth };
function getLastMonth() {
  const from = dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs().endOf('month').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
  /*const dateToday = new Date();
  const from = dayjs(new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)).format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs(new Date(dateToday.getFullYear(), dateToday.getMonth() + 1, 0, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
  */
  return {
    from,
    to,
  };
}
export { getLastMonth };

const defaultDates = [
  { value: '0', label: 'Сегодня' },
  { value: '1', label: 'Вчера' },
  { value: '2', label: 'Эта неделя' },
  { value: '3', label: 'Прошедшая неделя' },
  { value: '4', label: 'Этот месяц' },
  { value: '5', label: 'Прошлый месяц' },
  { value: '6', label: 'Этот квартал' },
  { value: '7', label: 'Прошлый квартал' },
  //{ value: '8', label: 'Это полугодие' },
  { value: '9', label: 'Этот год' },
];
export { defaultDates };

function getFromTo(s) {
  switch (s) {
    case '0':
      return getToday();
    case '1':
      return getYesterday();
    case '2':
      return getWeek();
    case '3':
      return getLastWeek();
    case '4':
      return getMonth();
    case '5':
      return getLastMonth();
    case '6':
      return getQuarter();
    case '7':
      return getLastQuarter();
    case '9':
      return getYear();
    default:
      return getMonth();
  }
}
export { getFromTo };
