import { Message } from './message';

export type Chat = {
  id: string;
  title: string;
  model: string;
  systemMessage: string;
  messages: Message[];
  temperature: number;
};
