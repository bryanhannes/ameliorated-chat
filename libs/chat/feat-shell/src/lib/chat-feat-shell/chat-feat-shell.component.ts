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
import { SidebarContentSmartComponent } from '@ameliorated-chat/chat/feat-chat';
import { Chat } from '@ameliorated-chat/chat/type-chat';

type PageViewModel = {
  sidebarOpen: boolean;
  currentChatTitle: string;
};

type State = {
  sidebarOpen: boolean;
  currentChat: Chat | null;
  currentChatId: string;
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
    SidebarContentSmartComponent
  ],
  templateUrl: './chat-feat-shell.component.html',
  styleUrls: ['./chat-feat-shell.component.scss']
})
export class ChatFeatShellComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'sidebarOpen',
    'currentChat'
  ]).pipe(
    map(({ sidebarOpen, currentChat }) => ({
      sidebarOpen,
      currentChatTitle: currentChat?.title || ''
    }))
  );

  constructor() {
    super();
    this.initialize({
      sidebarOpen: true,
      currentChatId: this.activatedRoute.snapshot.params['id'],
      currentChat: null,
      chats: []
    });

    const currentChatId$ = this.activatedRoute.firstChild?.params.pipe(
      map((params) => params['id'])
    );

    const currentChat$ = this.onlySelectWhen(['currentChatId', 'chats']).pipe(
      map(({ currentChatId, chats }) => {
        return chats.find((chat) => chat.id === currentChatId) || null;
      })
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
