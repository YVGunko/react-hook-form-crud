import dayjs from 'dayjs';

const defaultListFormValues = {
  isUser: false,
  defaultDates: '2',
};
export { defaultListFormValues };

/*const defaultDates = [
  { value: '0', label: 'Сегодня' },
  { value: '1', label: 'Вчера' },
  { value: '2', label: 'Эта неделя' },
  { value: '3', label: 'Этот месяц' },
  { value: '4', label: 'Этот квартал' },
  { value: '5', label: 'Это полугодие' },
  { value: '6', label: 'Этот год' },
];
export { defaultDates };*/

const defaultDates = [
  { value: '2', label: 'Эта неделя' },
  { value: '3', label: 'Этот месяц' },
];
export { defaultDates };

function getWeekDays() {
  const firstDay = 1; /* 0=Sun, 1=Mon, ... */
  const dateToday = new Date();
  const cd = dateToday.getDate() - dateToday.getDay();
  const from = dayjs(new Date(dateToday.setDate(cd + firstDay))).format('YYYY-MM-DD HH:mm:ss');
  const to = dayjs(new Date(dateToday.setDate(cd + 6 + firstDay))).format('YYYY-MM-DD HH:mm:ss');

  return {
    from,
    to,
  };
}
export { getWeekDays };

function getMonthDays() {
  //const from = new Date(Date.UTC(year, month, 1));
  //const to = new Date(Date.UTC(year, month + 1, 0));
  const dateToday = new Date();
  const from = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1);
  const to = new Date(dateToday.getFullYear(), dateToday.getMonth() + 1, 0);
  return {
    from,
    to,
  };
}
export { getMonthDays };

function getFromTo(s) {
  switch (s) {
    case '2':
      return getWeekDays();
    default:
      return getMonthDays();
  }
}
export { getFromTo };
