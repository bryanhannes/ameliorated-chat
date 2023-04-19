import { Injectable } from '@angular/core';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat, Role } from '@ameliorated-chat/shared/type-chat';
import {
  getFromLocalStorage,
  patchLocalStorage
} from '@ameliorated-chat/frontend/util-local-storage';

export type ChatState = {
  sidebarOpen: boolean;
  openAIApiKey: string;
  chats: Chat[];
  useEnterToSend: boolean; // Still need to implement this;
  userProfilePicUrl: string;
  inputApiKeyDialogVisible: boolean;
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
      sidebarOpen: getFromLocalStorage('sidebarOpen', false),
      openAIApiKey: getFromLocalStorage('openApiKey', ''),
      chats: getFromLocalStorage('chats', mockChats),
      useEnterToSend: getFromLocalStorage('useEnterToSend', false),
      userProfilePicUrl: getFromLocalStorage('userProfilePicUrl', ''),
      inputApiKeyDialogVisible: false
    });
  }

  public toggleSidebar(): void {
    const sidebarOpen = !this.snapshot.sidebarOpen;
    this.patch({ sidebarOpen });
    patchLocalStorage('sidebarOpen', sidebarOpen);
  }

  public setOpenApiKey(apiKey: string): void {
    this.patch({ openAIApiKey: apiKey });
    patchLocalStorage('openApiKey', apiKey);
  }

  public newChat(uuid: string): void {
    const chat: Chat = {
      title: 'New Chat',
      messages: [
        {
          content: 'You are ChatGPT, a large language model trained by OpenAI.',
          role: 'system'
        }
      ],
      model: 'gpt-3.5-turbo',
      systemMessage:
        'You are ChatGPT, a large language model trained by OpenAI.',
      id: uuid
    };

    const chats: Chat[] = [...this.snapshot.chats, chat];
    this.patch({ chats });

    patchLocalStorage('chats', chats);
  }

  public newChatMessage(
    message: string,
    currentChatId: string,
    role: Role = 'user'
  ): void {
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
            role: role
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
      patchLocalStorage('chats', newChats);
    }
  }

  public openInputApiKeyDialog(): void {
    this.patch({ inputApiKeyDialogVisible: true });
  }

  public closeInputApiKeyDialog(): void {
    this.patch({ inputApiKeyDialogVisible: false });
  }

  public updateChatTitle(newTitle: string, chatId: string) {
    const newChats = this.snapshot.chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          title: newTitle
        };
      } else {
        return chat;
      }
    });
    this.patch({ chats: newChats });
    patchLocalStorage('chats', newChats);
  }

  public deleteChat(id: string): void {
    const newChats = this.snapshot.chats.filter((chat) => chat.id !== id);
    this.patch({ chats: newChats });
    patchLocalStorage('chats', newChats);
  }
}
