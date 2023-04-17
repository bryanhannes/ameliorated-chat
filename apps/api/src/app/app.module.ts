import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiFeatChatModule } from '@ameliorated-chat/api/feat-chat';

@Module({
  imports: [ApiFeatChatModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
