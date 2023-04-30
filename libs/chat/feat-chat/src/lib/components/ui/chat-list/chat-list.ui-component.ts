import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '@ameliorated-chat/chat/type-chat';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditableUiComponent } from '@ameliorated-chat/frontend/ui-design-system';
import { InputState } from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';

type ViewModel = {
  favoritedChats: Chat[];
  allChats: Chat[];
  currentChatId: string | null;
  showEmptyState: boolean;
};

type ChatListInputState = {
  chats: Chat[];
  currentChatId: string | null;
};

@Component({
  selector: 'ac-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, EditableUiComponent],
  templateUrl: './chat-list.ui-component.html',
  styleUrls: ['./chat-list.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListUiComponent {
  @InputState()
  private readonly inputState$!: Observable<ChatListInputState>;
  @Input() public chats: Chat[] = [];
  @Input() public currentChatId: string | null = null;
  @Output() public readonly chatTitleEdited = new EventEmitter<{
    newTitle: string;
    id: string;
  }>();
  @Output() public readonly chatDeleted = new EventEmitter<string>();
  @Output() public readonly toggleChatAsFavorite = new EventEmitter<string>();
  @Output() public readonly chatClicked = new EventEmitter<string>();
  public readonly tracker: TrackByFunction<Chat> = (index, item) => item.id;

  public readonly vm$: Observable<ViewModel> = this.inputState$.pipe(
    map(({ chats, currentChatId }) => {
      const favoritedChats: Chat[] = chats.filter((chat) => chat.favorited);
      return {
        favoritedChats,
        allChats: chats,
        currentChatId,
        showEmptyState: chats.length === 0
      };
    })
  );

  public onChatTitleEdited(newTitle: string, id: string): void {
    this.chatTitleEdited.emit({ newTitle, id });
  }

  public onChatDelete(id: string): void {
    this.chatDeleted.emit(id);
  }

  public onToggleChatAsFavorite(id: string): void {
    this.toggleChatAsFavorite.emit(id);
  }

  public onChatClicked(id: string): void {
    this.chatClicked.emit(id);
  }
}
