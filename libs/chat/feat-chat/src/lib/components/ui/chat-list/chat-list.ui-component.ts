import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '@ameliorated-chat/chat/type-chat';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ac-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chat-list.ui-component.html',
  styleUrls: ['./chat-list.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListUiComponent {
  @Input() public chats: Chat[] = [];
  @Input() public currentChatId: string | null = null;
}
