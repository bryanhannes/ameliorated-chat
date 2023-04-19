import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '@ameliorated-chat/shared/type-chat';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditableComponent } from '@ameliorated-chat/frontend/ui-design-system';

@Component({
  selector: 'ac-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, EditableComponent],
  templateUrl: './chat-list.ui-component.html',
  styleUrls: ['./chat-list.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListUiComponent {
  @Input() public chats: Chat[] = [];
  @Input() public currentChatId: string | null = null;
  @Output() public readonly chatTitleEdited = new EventEmitter<{
    newTitle: string;
    id: string;
  }>();
  @Output() public readonly chatDeleted = new EventEmitter<string>();
  public readonly tracker: TrackByFunction<Chat> = (index, item) => item.id;

  public onChatTitleEdited(newTitle: string, id: string): void {
    this.chatTitleEdited.emit({ newTitle, id });
  }

  public onChatDelete(id: string): void {
    this.chatDeleted.emit(id);
  }
}
