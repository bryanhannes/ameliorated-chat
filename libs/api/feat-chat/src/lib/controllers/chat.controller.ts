import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { Message } from '@ameliorated-chat/shared/type-chat';

@Controller('chat')
export class ChatController {
  @Post()
  @HttpCode(200)
  async getChatCompletion(
    @Body('messages') messages: Message[],
    @Body('apiKey') apiKey: string,
    @Body('model') model = 'gpt-3.5-turbo',
    @Res() response
  ): Promise<void> {
    console.log('messages', messages);
    console.log('apiKey', apiKey);
    console.log('model', model);
    const stream = await this.chatService.getChatCompletion(
      messages,
      apiKey,
      model
    );

    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Transfer-Encoding', 'chunked');
    response.setHeader('Acess-Control-Allow-Origin', 'http://localhost:4200');
    stream.on('data', (chunk: Buffer) => {
      // Messages in the event stream are separated by a pair of newline characters.
      const payloads = chunk.toString().split('\n\n');
      for (const payload of payloads) {
        if (payload.includes('[DONE]')) return;
        if (payload.startsWith('data:')) {
          const data = payload.replace(/(\n)?^data:\s*/g, ''); // in case there's multiline data event
          try {
            const delta = JSON.parse(data.trim());
            if (delta.choices[0].delta?.content) {
              response.write(delta.choices[0].delta?.content);
              console.log(delta.choices[0].delta?.content);
            }
          } catch (error) {
            console.log(`Error with JSON.parse and ${payload}.\n${error}`);
          }
        }
      }
    });

    stream.on('end', () => {
      console.log('Stream done');
      response.end();
    });
    stream.on('error', (e: Error) => {
      console.error('Error', e);
      response.end();
    });
  }

  constructor(private readonly chatService: ChatService) {}
}
