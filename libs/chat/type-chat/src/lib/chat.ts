import { Message } from './message';

export type Chat = {
  id: string;
  title: string;
  model: string;
  systemMessage: string;
  messages: Message[];
  temperature: number;
  folderId?: string;
  favorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
};
