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
import { SettingsIconUiComponent } from '@ameliorated-chat/frontend/ui-icons';

type PageViewModel = {
  sidebarOpen: boolean;
  currentChatTitle: string;
  temperatureOfCurrentChat: number;
  modelOfCurrentChat: string;
  messagesCountOfCurrentChat: number;
  showSettingsDropdown: boolean;
};

type State = {
  sidebarOpen: boolean;
  currentChat: Chat | null;
  currentChatId: string | null;
  chats: Chat[];
  showSettingsDropdown: boolean;
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
    SidebarFooterContentUiComponent,
    SettingsIconUiComponent
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
    'chats',
    'showSettingsDropdown'
  ]).pipe(
    map(({ sidebarOpen, currentChat, showSettingsDropdown }) => ({
      sidebarOpen,
      currentChatTitle: currentChat ? currentChat?.title : '',
      temperatureOfCurrentChat: currentChat ? currentChat?.temperature : 0,
      modelOfCurrentChat: currentChat ? currentChat?.model : '',
      messagesCountOfCurrentChat: currentChat
        ? currentChat?.messages.length
        : 0,
      showSettingsDropdown
    }))
  );

  constructor() {
    super();
    this.initialize({
      sidebarOpen: true,
      currentChatId: null,
      currentChat: null,
      chats: [],
      showSettingsDropdown: false
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

  public openHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar();
  }

  public closeHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar();
  }
}
