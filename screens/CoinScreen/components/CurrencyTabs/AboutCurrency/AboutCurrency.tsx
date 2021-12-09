import { useTypedTranslation } from 'hooks';
import { TranslationObject } from 'libs/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from 'types';

import { AboutCoin, AboutToken } from './components';

type AboutCurrencyProps = {
  currency: string;
  token: boolean;
  alias: string;
  contract: string | null;
  info: any;
};

const AboutCurrency: React.FC<AboutCurrencyProps> = ({ currency, token, alias, contract, info }) => {
  const { i18n } = useTranslation();
  const coin = useTypedTranslation<TranslationObject['screens']['coin']>('screens.coin');
  const locale = i18n.language as Language;
  const symbol = locale === 'en' ? 'USD' : 'RUB';

  const transformValue = (val: number, locale: Language) => {
    if (!val) {
      return '';
    }
    const badge = locale === 'en' ? '$' : '₽';
    const shortStr = {
      ru: {
        mln: 'млн',
        mlr: 'млр',
        trl: 'трлн',
      },
      en: {
        mln: 'mln',
        mlr: 'mlr',
        trl: 'trl',
      },
    };
    const value = val.toString().split('.')[0];
    const length = value.length;

    if (length >= 13) {
      return `${value.slice(0, length - 12)}.${value.slice(length - 12, length - 10)} ${shortStr[locale].mlr} ${badge}`;
    } else if (length >= 10) {
      return `${value.slice(0, length - 9)}.${value.slice(length - 9, length - 7)} ${shortStr[locale].mlr} ${badge}`;
    } else if (length >= 7) {
      return `${value.slice(0, length - 6)}.${value.slice(length - 6, length - 4)} ${shortStr[locale].mln} ${badge}`;
    } else {
      return `${value} ${badge}`;
    }
  };

  return (
    <>
      {token ? (
        <AboutToken info={info} coin={coin} contract={contract} alias={alias} />
      ) : (
        <AboutCoin
          transformValue={transformValue}
          info={info}
          currency={currency}
          locale={locale}
          symbol={symbol}
          coin={coin}
        />
      )}
    </>
  );
};

export default AboutCurrency;
