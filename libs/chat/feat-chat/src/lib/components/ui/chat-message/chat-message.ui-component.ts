import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, Role } from '@ameliorated-chat/chat/type-chat';
import { InputState } from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';

type ChatMessageInputState = {
  message: Message | null;
};

type ViewModel = {
  message: string;
  avatarUrl: string;
  isUserMessage: boolean;
};

@Component({
  selector: 'ac-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.ui-component.html',
  styleUrls: ['./chat-message.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageUiComponent {
  @InputState()
  private readonly inputState$!: Observable<ChatMessageInputState>;
  @Input() public message: Message | null = null;

  public readonly vm$: Observable<ViewModel> = this.inputState$.pipe(
    map(({ message }) => {
      return {
        message: message?.message ?? '',
        avatarUrl: getAvatar(message?.role ?? 'user'),
        isUserMessage: message?.role === 'user'
      };
    })
  );
}

function getAvatar(role: Role) {
  if (role === 'user') {
    return '👨';
  }

  if (role === 'system') {
    return '⛭';
  }

  if (role === 'assistant') {
    return '🤖';
  }

  return '';
}
