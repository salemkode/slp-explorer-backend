import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidAddress, toCashAddress } from 'bchaddrjs-slp';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenService } from 'src/token/token.service';
import { TxService } from 'src/transactions/tx.service';
import { slice } from 'src/util/slice';
import { formated_slp_address, indexer_slp_address } from './address.type';

@Injectable()
export class AddressService {
  constructor(
    private IndexerService: IndexerService,
    private TokenService: TokenService,
    private TxService: TxService,
  ) {}

  //
  getCashAddress(address: string): string {
    if (!isValidAddress(address)) {
      throw new BadRequestException('Address not valid');
    } else {
      return toCashAddress(address);
    }
  }

  //
  async fatchAddressData(address: string): Promise<indexer_slp_address> {
    try {
      const result = await this.IndexerService.post<indexer_slp_address>(
        'address',
        {
          address,
        },
      );

      // Return result data
      return result;
    } catch (err) {
      return {
        balance: {
          balances: [],
          txs: [],
          utxos: [],
        },
      };
    }
  }

  //
  async getAddressData(address: string): Promise<formated_slp_address> {
    // Fatch address data from slp explorer
    const addressData = await this.fatchAddressData(address);

    // Formated data
    return await this.formatAddressData(addressData);
  }

  //
  async formatAddressData({
    balance,
  }: indexer_slp_address): Promise<formated_slp_address> {
    return {
      balance: await this.getFormatedBalance(balance.balances),
      transaction: await this.getFormatedTransactions(balance.txs),
    };
  }

  //
  async getBalances(
    balances: indexer_slp_address['balance']['balances'],
    index = 0,
  ): Promise<formated_slp_address['balance']['balances']> {
    type token = formated_slp_address['balance']['balances'][0];
    const promises: Promise<token>[] = [];

    // Select 7 items by index
    const _balances = slice(balances, index * 7, (index + 1) * 7);

    //
    const { TokenService } = this;

    //
    async function getTokenPromise(token: {
      tokenId: string;
      qty: string;
    }): Promise<token> {
      const { tokenData } = await TokenService.fatchTokenData(token.tokenId);

      //
      return {
        tokenId: token.tokenId,
        name: tokenData.name,
        qty: token.qty,
        ticker: tokenData.ticker,
      };
    }

    //
    _balances.forEach((token) => {
      if (+token.qty) promises.push(getTokenPromise(token));
    });

    //
    return Promise.all(promises);
  }

  //
  async getTransactions(
    transactions: indexer_slp_address['balance']['txs'],
    index = 0,
  ): Promise<formated_slp_address['transaction']['transactions']> {
    type Transactions = formated_slp_address['transaction']['transactions'][0];
    const promises: Promise<Transactions>[] = [];

    // Select 7 items by index
    const _transactions = slice(transactions, index * 7, (index + 1) * 7);

    //
    const { TxService } = this;

    //
    async function getTransactionsPromise(
      tx: indexer_slp_address['balance']['txs'][0],
    ): Promise<Transactions> {
      const { txData } = await TxService.fatchTxData(tx.txid);

      // Calc amount
      const qty = txData.vout.reduce(
        (previousValue, currentValue) => previousValue + currentValue.tokenQty,
        0,
      );

      //
      return {
        block: +tx.height,
        txid: tx.txid,
        type: txData.tokenTxType,
        qty,
        tokenId: txData.tokenId,
        tokenName: txData.tokenName,
      };
    }

    //
    _transactions.forEach((tx) => {
      promises.push(getTransactionsPromise(tx));
    });

    //
    return Promise.all(promises);
  }

  //
  async getFormatedBalance(
    balance: indexer_slp_address['balance']['balances'],
    index = 0,
  ): Promise<formated_slp_address['balance']> {
    const balances = await this.getBalances(balance, index);

    //
    return {
      allPage: Math.ceil(balances.length / 7),
      currentPage: index + 1,
      balances: await this.getBalances(balances, index),
    };
  }

  //
  async getFormatedTransactions(
    transaction: indexer_slp_address['balance']['txs'],
    index = 0,
  ): Promise<formated_slp_address['transaction']> {
    //
    return {
      allPage: Math.ceil(transaction.length / 7),
      currentPage: index + 1,
      transactions: await this.getTransactions(transaction, index),
    };
  }
}
