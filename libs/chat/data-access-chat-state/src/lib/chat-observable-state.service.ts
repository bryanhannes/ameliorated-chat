import { Injectable } from '@angular/core';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat } from '@ameliorated-chat/shared/type-chat';

export type ChatState = {
  sidebarOpen: boolean;
  openApiKey: string;
  chats: Chat[];
  useEnterToSend: boolean; // Still need to implement this;
  userProfilePicUrl: string;
};

const mockChats: Chat[] = [
  {
    title: '(Example) Fix math problem',
    messages: [
      {
        content: 'You are ChatGPT, a large language model trained by OpenAI.',
        role: 'system'
      },
      {
        content: 'What is 1 + 1?',
        role: 'user'
      },
      {
        content: '1 + 1 equals 2',
        role: 'assistant'
      }
    ],
    model: 'gpt-3.5-turbo',
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI.',
    id: 'd3bd-d3bd-4430-9cc8-7aa79dca126a90da1a66'
  },
  {
    title: '(Example) Fruits',
    messages: [
      {
        content: 'You are ChatGPT, a large language model trained by OpenAI.',
        role: 'system'
      },
      {
        content: 'Name 10 fruits',
        role: 'user'
      },
      {
        content:
          'Apple, Banana, Orange, Pineapple, Mango, Watermelon, Kiwi, Grapes, Peach, Strawberry ',
        role: 'assistant'
      }
    ],
    model: 'gpt-3.5-turbo',
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI.',
    id: '7c34-7c34-4430-8fc0-3007152ae67cd91410a1'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ChatObservableState extends ObservableState<ChatState> {
  constructor() {
    super();
    this.initialize({
      sidebarOpen: true,
      openApiKey: '',
      chats: mockChats,
      useEnterToSend: false,
      userProfilePicUrl: ''
    });
  }

  public toggleSidebar(): void {
    this.patch({ sidebarOpen: !this.snapshot.sidebarOpen });
  }

  public setOpenApiKey(apiKey: string): void {
    this.patch({ openApiKey: apiKey });
  }

  public newChat(uuid: string): void {
    const chat: Chat = {
      title: 'New Chat',
      messages: [],
      model: 'gpt-3.5-turbo',
      systemMessage:
        'You are ChatGPT, a large language model trained by OpenAI.',
      id: uuid
    };

    this.patch({ chats: [...this.snapshot.chats, chat] });
  }

  public newChatMessage(message: string, currentChatId: string): void {
    const currentChat = this.snapshot.chats.find(
      (chat) => chat.id === currentChatId
    );

    if (currentChat) {
      const newChat: Chat = {
        ...currentChat,
        messages: [
          ...currentChat.messages,
          {
            content: message,
            role: 'user'
          }
        ]
      };

      const newChats: Chat[] = this.snapshot.chats.map((chat) => {
        if (chat.id === currentChatId) {
          return newChat;
        } else {
          return chat;
        }
      });

      this.patch({ chats: newChats });
    }
  }
}
