import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { ChatObservableState } from '@ameliorated-chat/chat/data-access-chat-state';
import { Title } from '@angular/platform-browser';
import { Chat } from '@ameliorated-chat/shared/type-chat';

@Injectable()
export class ChatTitleStrategy extends TitleStrategy {
  private readonly chatObservableState = inject(ChatObservableState);
  private readonly title = inject(Title);

  public updateTitle(snapshot: RouterStateSnapshot): void {
    this.chatObservableState
      .onlySelectWhen(['chats'])
      .subscribe(({ chats }) => {
        const chat: Chat | undefined = chats.find((chat) =>
          snapshot.url.includes(chat.id)
        );

        if (chat) {
          this.title.setTitle(`${chat.title} | Ameliorated Chat`);
        }
      });
  }
}
