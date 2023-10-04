const defaultValues = {
  dateFrom: new Date(),
  dateTill: new Date(),
  sliderValue: false,
  defaultDates: '0',
};
export { defaultValues };

const defaultDates = [
  { value: '0', label: 'Этот месяц' },
  { value: '1', label: 'Эта неделя' },
  { value: '2', label: 'Сегодня' },
  { value: '3', label: 'Этот квартал' },
];
export { defaultDates };
