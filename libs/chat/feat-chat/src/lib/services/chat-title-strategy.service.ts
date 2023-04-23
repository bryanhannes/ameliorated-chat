import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Chat } from '@ameliorated-chat/chat/type-chat';
import { ChatObservableState } from '@ameliorated-chat/chat/data-access-chat-state';

@Injectable({
  providedIn: 'root'
})
export class ChatTitleStrategy extends TitleStrategy {
  private readonly title: Title = inject(Title);
  private readonly chatObservableState: ChatObservableState =
    inject(ChatObservableState);

  public updateTitle(snapshot: RouterStateSnapshot): void {
    this.chatObservableState
      .onlySelectWhen(['chats'])
      .subscribe(({ chats }) => {
        const chat: Chat | undefined = chats.find((chat: Chat) =>
          snapshot.url.includes(chat.id)
        );

        if (chat) {
          this.title.setTitle(`${chat.title} | Ameliorated Chat`);
        }
      });
  }
}
