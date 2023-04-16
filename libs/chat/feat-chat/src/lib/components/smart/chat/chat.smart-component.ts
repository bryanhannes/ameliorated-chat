import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxUiComponent } from '../../ui/chatbox/chatbox.ui-component';
import { AppInfoUiComponent } from '../../ui/app-info/app-info.ui-component';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat } from '@ameliorated-chat/shared/type-chat';
import { FacadeService } from '../../../facade.service';
import { map, Observable, pipe, tap } from 'rxjs';
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

  public readonly vm$: Observable<ViewModel> = this.onlySelectWhen([
    'chat'
  ]).pipe(
    map(({ chat }) => ({ chat })),
    tap(console.log)
  );

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
    console.log(message);
  }
}

const mapToChat = () =>
  pipe(
    map(
      ({ currentChatId, chats }: { currentChatId: string; chats: Chat[] }) =>
        chats.find((chat) => chat.id === currentChatId) || null
    )
  );
