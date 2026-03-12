import { Module } from '@nestjs/common';
import { ScoreGateway } from './score.gateway';

@Module({
  providers: [ScoreGateway],
})
export class ScoreModule {}
