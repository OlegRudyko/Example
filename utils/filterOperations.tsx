import { TransactionAllInformation } from '__generated__/types';
import { ArrowAltDownIcon, ArrowAltTopIcon, ArrowDownIcon, ArrowReturnIcon, ExchangeIcon } from 'assets/svgs';
import React from 'react';

export const filterOperations = (
  operation: TransactionAllInformation,
  type: 'icon' | 'text' | 'type',
  transactions: any = {},
) => {
  const exchange = {
    icon: <ExchangeIcon fill="#000" />,
    text: transactions.exchange,
    type: 'exchange',
  };
  const withdrawal = {
    icon: <ArrowReturnIcon fill="#000" />,
    text: transactions.withdrawal,
    type: 'withdrawal',
  };
  const deposit = {
    icon: <ArrowDownIcon fill="#000" />,
    text: transactions.deposit,
    type: 'deposit',
  };
  const fiatWithdrawal = {
    icon: <ArrowAltTopIcon fill="#000" />,
    text: transactions.fiatWithdrawal,
    type: 'fiatWithdrawal',
  };
  const fiatDeposit = {
    icon: <ArrowAltDownIcon fill="#000" />,
    text: transactions.fiatDeposit,
    type: 'fiatDeposit',
  };
  const bonus = {
    icon: <ArrowDownIcon fill="#000" />,
    text: transactions.bonus,
    type: 'bonus',
  };

  if (operation.type === 'exchange') {
    return exchange[type];
  } else if (operation.type === 'deposit' && operation.addressFrom === null) {
    return fiatDeposit[type];
  } else if (operation.type === 'deposit') {
    return deposit[type];
  } else if (operation.type === 'withdrawal' && operation.addressTo === null) {
    return fiatWithdrawal[type];
  } else if (operation.type === 'withdrawal') {
    return withdrawal[type];
  } else if (operation.type === 'bonus_deposit') {
    return bonus[type];
  }
};
