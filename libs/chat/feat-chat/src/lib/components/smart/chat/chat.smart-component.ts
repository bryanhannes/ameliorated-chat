import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ChatboxUiComponent } from '../../ui/chatbox/chatbox.ui-component';
import { AppInfoUiComponent } from '../../ui/app-info/app-info.ui-component';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat, Message } from '@ameliorated-chat/shared/type-chat';
import { FacadeService } from '../../../facade.service';
import { map, Observable, pipe } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatMessageUiComponent } from '../../ui/chat-message/chat-message.ui-component';

type ViewModel = {
  chat: Chat | null;
};

type State = {
  chat: Chat | null;
  chats: Chat[];
  currentChatId: string;
};

@Component({
  selector: 'ac-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatboxUiComponent,
    AppInfoUiComponent,
    ChatMessageUiComponent
  ],
  templateUrl: './chat.smart-component.html',
  styleUrls: ['./chat.smart-component.scss']
})
export class ChatSmartComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  public readonly vm$: Observable<ViewModel> = this.onlySelectWhen([
    'chat'
  ]).pipe(map(({ chat }) => ({ chat })));

  public readonly tracker = (i: number) => i;

  constructor() {
    super();
    this.initialize({
      chat: null,
      chats: [],
      currentChatId: this.activatedRoute.snapshot.params['id']
    });

    const currentChatId$ = this.activatedRoute.params.pipe(
      map((params) => params['id'])
    );

    this.connect({
      ...this.chatObservableState.pick(['chats']),
      currentChatId: currentChatId$,
      chat: this.onlySelectWhen(['chats', 'currentChatId']).pipe(mapToChat())
    });
  }

  public newChatMessage(message: string): void {
    this.chatObservableState.newChatMessage(
      message,
      this.snapshot.currentChatId
    );

    const messages: Message[] =
      this.chatObservableState.snapshot.chats.find(
        (chat) => chat.id === this.snapshot.currentChatId
      )?.messages || [];

    if (messages.length > 0) {
      this.facade.newChatMessage(messages).subscribe((answer) => {
        this.chatObservableState.patch({
          chats: this.chatObservableState.snapshot.chats.map((chat) =>
            chat.id === this.snapshot.currentChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      content: answer,
                      role: 'assistant'
                    }
                  ]
                }
              : chat
          )
        });

        console.log(this.chatObservableState.snapshot.chats);

        this.viewportScroller.scrollToPosition([0, 9999999]);
      });
    }
  }
}

const mapToChat = () =>
  pipe(
    map(
      ({ currentChatId, chats }: { currentChatId: string; chats: Chat[] }) =>
        chats.find((chat) => chat.id === currentChatId) || null
    )
  );
