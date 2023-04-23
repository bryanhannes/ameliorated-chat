import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat } from '@ameliorated-chat/chat/type-chat';
import { FacadeService } from '../../../facade.service';
import { debounceTime, map, Observable, pipe } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChatListUiComponent } from '../../ui/chat-list/chat-list.ui-component';
import { generateUUID } from '@ameliorated-chat/frontend/util-uuid';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getCurrentId } from '../../../utils/current-id.util';

type PageViewModel = {
  currentChatId: string | null;
  filteredChats: Chat[];
  searchText: string;
};

type State = {
  chats: Chat[];
  searchText: string;
  filteredChats: Chat[];
  currentChatId: string | null;
};

@Component({
  selector: 'ac-sidebar-content',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatListUiComponent, RouterModule],
  templateUrl: './sidebar-content.smart-component.html',
  styleUrls: ['./sidebar-content.smart-component.scss']
})
export class SidebarContentSmartComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'filteredChats',
    'searchText',
    'currentChatId'
  ]).pipe(
    map(({ filteredChats, searchText, currentChatId }) => ({
      filteredChats,
      searchText,
      currentChatId
    }))
  );

  constructor() {
    super();
    this.initialize({
      chats: [],
      filteredChats: [],
      searchText: '',
      currentChatId: null
    });

    const currentChatId$ = getCurrentId(this.router, this.activatedRoute);

    const filteredChats$ = this.onlySelectWhen(['chats', 'searchText']).pipe(
      debounceTime(500),
      mapToFilteredChats()
    );

    this.connect({
      ...this.chatObservableState.pick(['chats']),
      currentChatId: currentChatId$,
      filteredChats: filteredChats$
    });
  }

  public newChat(): void {
    const uuid = generateUUID();
    this.chatObservableState.newChat(uuid);
    this.router.navigate([uuid]);
  }

  public searchTextChanged(searchText: string): void {
    this.patch({ searchText });
  }

  public chatTitleEdited({
    newTitle,
    id
  }: {
    newTitle: string;
    id: string;
  }): void {
    this.chatObservableState.updateChatTitle(newTitle, id);
  }

  public chatDeleted(id: string): void {
    this.chatObservableState.deleteChat(id);

    if (this.snapshot.currentChatId === id) {
      this.router.navigateByUrl('/');
    }
  }
}

const mapToFilteredChats = () =>
  pipe(
    map(({ chats, searchText }: State) => {
      if (searchText === '') {
        return chats;
      }

      return chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchText.toLowerCase())
      );
    })
  );
