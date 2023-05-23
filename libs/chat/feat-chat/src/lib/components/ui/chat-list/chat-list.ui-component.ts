import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat, Folder } from '@ameliorated-chat/chat/type-chat';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditableUiComponent } from '@ameliorated-chat/frontend/ui-design-system';
import { InputState } from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

type FolderWithChats = Folder & { chatCount: number; chats: Chat[] };

type ViewModel = {
  favoritedChats: Chat[];
  allChatsWithoutFolder: Chat[];
  currentChatId: string | null;
  showEmptyState: boolean;
  folders: FolderWithChats[];
};

type ChatListInputState = {
  chats: Chat[];
  folders: Folder[];
  currentChatId: string | null;
};

@Component({
  selector: 'ac-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    EditableUiComponent,
    DragDropModule
  ],
  templateUrl: './chat-list.ui-component.html',
  styleUrls: ['./chat-list.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListUiComponent {
  @InputState()
  private readonly inputState$!: Observable<ChatListInputState>;
  @Input() public chats: Chat[] = [];
  @Input() public folders: Folder[] = [];
  @Input() public currentChatId: string | null = null;
  @Output() public readonly chatTitleEdited = new EventEmitter<{
    newTitle: string;
    id: string;
  }>();
  @Output() public readonly folderTitleEdited = new EventEmitter<{
    newTitle: string;
    id: string;
  }>();
  @Output() public readonly chatDeleted = new EventEmitter<string>();
  @Output() public readonly folderDeleted = new EventEmitter<string>();
  @Output() public readonly folderToggled = new EventEmitter<string>();
  @Output() public readonly addChatToFolder = new EventEmitter<{
    chatId: string;
    folderId: string;
  }>();
  @Output() public readonly toggleChatAsFavorite = new EventEmitter<string>();
  @Output() public readonly chatClicked = new EventEmitter<string>();
  public readonly chatTracker: TrackByFunction<Chat> = (index, item) => item.id;
  public readonly folderTracker: TrackByFunction<FolderWithChats> = (
    index,
    item
  ) => item.id;

  public readonly vm$: Observable<ViewModel> = this.inputState$.pipe(
    map(({ chats, currentChatId, folders }) => {
      const favoritedChats: Chat[] = chats.filter((chat) => chat.favorited);
      const foldersWithChatCount: FolderWithChats[] = folders.map(
        (folder: Folder) => ({
          ...folder,
          chatCount: chats.filter((chat) => chat.folderId === folder.id).length,
          chats: chats.filter((chat) => chat.folderId === folder.id)
        })
      );
      const allChatsWithoutFolder: Chat[] = chats.filter(
        (chat) => !chat.folderId
      );

      return {
        favoritedChats,
        allChatsWithoutFolder,
        currentChatId,
        showEmptyState: chats.length === 0,
        folders: foldersWithChatCount
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

  public onFolderTitleEdited(newTitle: string, id: string): void {
    this.folderTitleEdited.emit({ newTitle, id });
  }

  public onFolderDelete(id: string): void {
    this.folderDeleted.emit(id);
  }

  public onToggleFolder(id: string): void {
    this.folderToggled.emit(id);
  }

  public chatDropped($event: CdkDragDrop<unknown, unknown>): void {
    const chatId = $event.item.data;
    const folderId = $event.container.data as string;
    this.addChatToFolder.emit({ chatId, folderId });
  }
}
