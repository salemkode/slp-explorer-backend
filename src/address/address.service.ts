import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidAddress, toCashAddress } from 'bchaddrjs-slp';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenService } from 'src/token/token.service';
import { TxService } from 'src/transactions/tx.service';
import { reverse, slice } from 'src/util/slice';
import {
  balance_item,
  formatted_slp_address,
  indexer_slp_address,
  transaction_item,
} from './address.type';

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
  async fetchAddressData(address: string): Promise<indexer_slp_address> {
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
  async getAddressData(address: string): Promise<formatted_slp_address> {
    // fetch address data from slp explorer
    const addressData = await this.fetchAddressData(address);

    // Formatted data
    return await this.formatAddressData(addressData, address);
  }

  //
  async formatAddressData(
    { balance }: indexer_slp_address,
    address: string,
  ): Promise<formatted_slp_address> {
    return {
      balance: await this.getFormattedBalance(balance.balances),
      transaction: await this.getFormattedTransactions(balance.txs, address),
    };
  }

  //
  async getBalances(
    balances: indexer_slp_address['balance']['balances'],
    index = 0,
  ): Promise<balance_item[]> {
    const promises: Promise<balance_item>[] = [];

    // Select 7 items by index
    const _balances = slice(balances, index * 7, (index + 1) * 7);

    //
    const { TokenService } = this;

    //
    async function getTokenPromise(
      token: indexer_slp_address['balance']['balances'][0],
    ): Promise<balance_item> {
      const { tokenData } = await TokenService.fetchTokenData(
        token.tokenId,
        false,
        true,
      );

      //
      return {
        tokenId: token.tokenId,
        name: tokenData.name,
        qty: TokenService.getRealQty(token.qty, tokenData.decimals),
        ticker: tokenData.ticker,
      };
    }

    //
    _balances.forEach((token) => promises.push(getTokenPromise(token)));

    //
    return Promise.all(promises);
  }

  //
  async getTransactions(
    transactions: indexer_slp_address['balance']['txs'],
    address: string,
    index = 0,
  ): Promise<transaction_item[]> {
    type Transactions = transaction_item;
    const promises: Promise<Transactions>[] = [];

    // Select 7 items by index
    const _transactions = reverse(transactions).slice(
      index * 7,
      (index + 1) * 7,
    );

    //
    const { TxService } = this;

    //
    async function getTransactionsPromise(
      tx: indexer_slp_address['balance']['txs'][0],
    ): Promise<Transactions> {
      const { txData } = await TxService.fetchTxData(tx.txid, true);

      // Calc amount
      let qty = 0;

      //
      txData.vin.forEach((input) => {
        if (input.address === address && input.tokenQty !== null) {
          qty = qty + input.tokenQty;
        }
      });

      //
      txData.vout.forEach((input) => {
        const addresses = input.scriptPubKey.addresses;

        //
        if (addresses && addresses.includes(address)) {
          if (input.tokenQty !== null) {
            qty = qty - input.tokenQty;
          }
        }
      });

      //
      return {
        block: +tx.height,
        txid: tx.txid,
        type: qty >= 0 ? 'SEND' : 'RECV',
        qty: Math.abs(qty),
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
  async getFormattedBalance(
    balance: indexer_slp_address['balance']['balances'],
    index = 0,
  ): Promise<formatted_slp_address['balance']> {
    //
    const balanceWithoutEmptyToken = balance.filter((token) => +token.qty);

    //
    const balances = await this.getBalances(balanceWithoutEmptyToken, index);

    //
    return {
      length: balanceWithoutEmptyToken.length,
      allPage: Math.ceil(balances.length / 7),
      currentPage: index + 1,
      balances,
    };
  }

  //
  async getFormattedTransactions(
    transaction: indexer_slp_address['balance']['txs'],
    address: string,
    index = 0,
  ): Promise<formatted_slp_address['transaction']> {
    //
    return {
      length: transaction.length,
      allPage: Math.ceil(transaction.length / 7),
      currentPage: index + 1,
      transactions: await this.getTransactions(transaction, address, index),
    };
  }
}
