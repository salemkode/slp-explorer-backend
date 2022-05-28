import { Controller, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';
import { formated_slp_token } from './token.type';

@Controller('/token/')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('/:tokenid')
  async getToken(@Param('tokenid') tokenid: string) {
    return await this.tokenService.getTokenData(tokenid);
  }

  @Get('/:tokenid/txs/:index')
  async getTokenTxsIndex(
    @Param('tokenid') tokenid: string,
    @Param('index') index: string,
  ): Promise<formated_slp_token['tx']> {
    const { tokenData } = await this.tokenService.fatchTokenData(tokenid, true);

    //
    return await this.tokenService.getTxsInfo(tokenData, +index);
  }
}
