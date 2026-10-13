import { Module } from '@nestjs/common';
import { IncomingGoodsService } from './incoming-goods.service';
import { IncomingGoodsController } from './incoming-goods.controller';

@Module({
  controllers: [IncomingGoodsController],
  providers: [IncomingGoodsService],
  exports: [IncomingGoodsService],
})
export class IncomingGoodsModule {}