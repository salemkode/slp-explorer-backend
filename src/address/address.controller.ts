import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('/address')
export class AddressController {
  constructor(private AddressService: AddressService) {}

  @Get('/:address')
  getAddress(@Param('address') address: string) {
    address = this.AddressService.getCashAddress(address);

    //
    return this.AddressService.getAddressData(address);
  }

  @Get('/:address/balance/:index')
  async getAddressTokens(
    @Param('address') address: string,
    @Param('index') index: string,
  ) {
    address = this.AddressService.getCashAddress(address);

    //
    const { balance } = await this.AddressService.fetchAddressData(address);

    //
    return this.AddressService.getFormatedBalance(balance.balances, +index);
  }

  @Get('/:address/transaction/:index')
  async getAddressTxs(
    @Param('address') address: string,
    @Param('index') index: string,
  ) {
    address = this.AddressService.getCashAddress(address);

    //
    const { balance } = await this.AddressService.fetchAddressData(address);

    //
    return this.AddressService.getFormatedTransactions(
      balance.txs,
      address,
      +index,
    );
  }
}
