import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderUiComponent,
  SidebarUiComponent
} from '@ameliorated-chat/frontend/ui-design-system';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { FacadeService } from '../facade.service';
import { map, Observable } from 'rxjs';
import {
  getCurrentId,
  SidebarContentSmartComponent,
  SidebarFooterContentUiComponent
} from '@ameliorated-chat/chat/feat-chat';
import { Chat } from '@ameliorated-chat/chat/type-chat';

type PageViewModel = {
  sidebarOpen: boolean;
  currentChatTitle: string;
  temperatureOfCurrentChat: number;
  modelOfCurrentChat: string;
  messagesCountOfCurrentChat: number;
};

type State = {
  sidebarOpen: boolean;
  currentChat: Chat | null;
  currentChatId: string | null;
  chats: Chat[];
};

@Component({
  selector: 'ac-shell',
  standalone: true,
  imports: [
    CommonModule,
    HeaderUiComponent,
    RouterOutlet,
    SidebarUiComponent,
    SidebarContentSmartComponent,
    SidebarFooterContentUiComponent
  ],
  templateUrl: './chat-feat-shell.component.html',
  styleUrls: ['./chat-feat-shell.component.scss']
})
export class ChatFeatShellComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService);
  private readonly router = inject(Router);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'sidebarOpen',
    'currentChat',
    'currentChatId',
    'chats'
  ]).pipe(
    map(({ sidebarOpen, currentChat }) => ({
      sidebarOpen,
      currentChatTitle: currentChat ? currentChat?.title : '',
      temperatureOfCurrentChat: currentChat ? currentChat?.temperature : 0,
      modelOfCurrentChat: currentChat ? currentChat?.model : '',
      messagesCountOfCurrentChat: currentChat ? currentChat?.messages.length : 0
    }))
  );

  constructor() {
    super();
    this.initialize({
      sidebarOpen: true,
      currentChatId: null,
      currentChat: null,
      chats: []
    });

    const currentChatId$ = getCurrentId(this.router, this.activatedRoute);
    const currentChat$ = this.onlySelectWhen(['currentChatId', 'chats']).pipe(
      map(
        ({ currentChatId, chats }) =>
          chats.find((chat) => chat.id === currentChatId) || null
      )
    );

    this.connect({
      ...this.chatObservableState.pick(['sidebarOpen', 'chats']),
      currentChatId: currentChatId$,
      currentChat: currentChat$
    });
  }

  public openSettingsMenu(): void {
    console.log('open settings menu');
  }

  public openHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar();
  }

  public closeHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar();
  }
}
