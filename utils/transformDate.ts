import { calendar } from 'screens/CoinScreen/components/CurrencyTabs/History/config';
import { Language } from 'types';

export const transformDate = (date: number, locale: Language, isFull: boolean = false) => {
  const data = new Date(date);
  const _date = data.getDate();
  const month = data.getMonth();
  const year = data.getFullYear();
  const hours = data.getHours();
  let minutes = data.getMinutes().toString();
  minutes = minutes.length === 1 ? '0' + minutes : minutes;

  return isFull
    ? `${_date} ${calendar[locale].months[month]} ${year}, ${hours}:${minutes}`
    : `${_date} ${calendar[locale].months[month]}, ${year}`;
};

export const transformDateForFilter = (date: string | Date) => {
  const data = typeof date === 'string' ? new Date(+date) : date;
  const _date = data.getDate();
  const month = data.getMonth();
  const year = data.getFullYear();

  return new Date(year, month, _date).getTime();
};
