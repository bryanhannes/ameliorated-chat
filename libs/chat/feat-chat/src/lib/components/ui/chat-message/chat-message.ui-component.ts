import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, Role } from '@ameliorated-chat/chat/type-chat';
import { InputState } from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';

type ChatMessageInputState = {
  message: Message | null;
  userProfilePicUrl: string;
};

type ViewModel = {
  message: string;
  avatarUrl: string;
  isUserMessage: boolean;
  isSystemMessage: boolean;
  isAssistantMessage: boolean;
  isDefaultUserIcon: boolean;
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
  @Input() public userProfilePicUrl = '';
  @Output() public readonly userProfilePicClicked = new EventEmitter<void>();
  @Output() public readonly systemOptionsClicked = new EventEmitter<void>();

  public readonly vm$: Observable<ViewModel> = this.inputState$.pipe(
    map(({ message, userProfilePicUrl }) => {
      const isUserMessage = message?.role === 'user';
      const isSystemMessage = message?.role === 'system';
      const isAssistantMessage = message?.role === 'assistant';
      const isDefaultUserIcon =
        !!userProfilePicUrl && userProfilePicUrl.length > 0;
      const avatarUrl =
        isDefaultUserIcon && isUserMessage
          ? userProfilePicUrl
          : getAvatarUrl(message?.role ?? 'user');

      return {
        message: message?.content ?? '',
        avatarUrl: avatarUrl,
        isUserMessage,
        isSystemMessage,
        isAssistantMessage,
        isDefaultUserIcon
      };
    })
  );

  public userAvatarClicked(): void {
    this.userProfilePicClicked.emit();
  }

  public systemAvatarClicked(): void {
    this.systemOptionsClicked.emit();
  }
}

// TODO make these URLs configurable
function getAvatarUrl(role: Role) {
  if (role === 'user') {
    return '/assets/images/avatar/user.svg';
  }

  if (role === 'system') {
    return '/assets/images/avatar/gear.svg';
  }

  if (role === 'assistant') {
    return '/assets/ameliorated-chat-logo.svg';
  }

  return '';
}
