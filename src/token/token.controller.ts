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

  @Get('/:tokenid/tx/:index')
  async getTokenTxsIndex(
    @Param('tokenid') tokenid: string,
    @Param('index') index: string,
  ): Promise<formated_slp_token['tx']> {
    const { tokenData } = await this.tokenService.fetchTokenData(
      tokenid,
      true,
      true,
    );

    //
    return await this.tokenService.getTxsInfo(tokenData, +index);
  }

  @Get('/:tokenid/nft/:index')
  async getTokenNftsIndex(
    @Param('tokenid') tokenid: string,
    @Param('index') index: string,
  ): Promise<formated_slp_token['nft']> {
    const { tokenData } = await this.tokenService.fetchTokenData(
      tokenid,
      true,
      true,
    );

    //
    return this.tokenService.getNftsChild(tokenData, +index);
  }
}
