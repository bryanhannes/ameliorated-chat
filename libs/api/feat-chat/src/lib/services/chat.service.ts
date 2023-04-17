import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { Message } from '@ameliorated-chat/shared/type-chat';
import { IncomingMessage } from 'http';

@Injectable()
export class ChatService {
  async getChatCompletion(
    messages: Message[],
    apiKey: string,
    model: string
  ): Promise<IncomingMessage> {
    const config = new Configuration({
      apiKey
    });

    const openai = new OpenAIApi(config);

    const response = await openai.createChatCompletion(
      {
        model,
        stream: true,
        max_tokens: 128,
        n: 1,
        messages
      },
      { responseType: 'stream' }
    );

    return response.data as unknown as IncomingMessage;
  }
}
