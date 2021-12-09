import { TransactionAllInformation } from '__generated__/types';
import { PickerValue } from 'components/ModalCoinFilter/components/PeriodInFilter/components/ModalDatePicker';
import { TypeOperations } from 'types';
import { transformDateForFilter } from 'utils/transformDate';

export const historyFilter = (
  data: TransactionAllInformation[],
  date: PickerValue,
  type: TypeOperations,
  status: string,
  currencies: number[],
) => {
  const filterForType = (item: TransactionAllInformation) => {
    const typeMapping: Record<TypeOperations, boolean> = {
      exchange: item.type === 'exchange',
      fiatDeposit: item.type === 'deposit' && item.addressFrom === null,
      deposit: item.type === 'deposit' && item.addressFrom !== null,
      fiatWithdrawal: item.type === 'withdrawal' && item.addressTo === null,
      withdrawal: item.type === 'withdrawal' && item.addressTo !== null,
      bonus: item.type === 'bonus_deposit',
      '': true,
    };
    return typeMapping[type];
  };

  const _filter = (item: TransactionAllInformation) => {
    const isIncludesCurrency: boolean = currencies.length
      ? currencies.includes(item.currencyFrom || -1) || currencies.includes(item.currencyTo || -1)
      : true;
    const createdAt = transformDateForFilter(item.createdAt);
    const inRange: boolean =
      date.from && date.to
        ? transformDateForFilter(date.from) <= createdAt && createdAt <= transformDateForFilter(date.to)
        : true;
    const _status = status.length ? item.status === status : true;

    return _status && filterForType(item) && isIncludesCurrency && inRange;
  };

  return data.filter((item) => _filter(item));
};
