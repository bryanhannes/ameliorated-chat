import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [HttpModule],
  exports: []
})
export class ApiFeatChatModule {}
