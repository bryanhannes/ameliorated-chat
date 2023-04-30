import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  getDefaultInputState,
  InputState,
  ObservableState
} from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';

type PageViewModel = {
  sidebarOpen: boolean;
  showSendOnEnterCheckbox: boolean;
  message: string;
  sendOnEnter: boolean;
};

type ChatboxInputState = {
  sendOnEnter: boolean;
  sidebarOpen: boolean;
};

type State = ChatboxInputState & {
  message: string;
};

@Component({
  selector: 'ac-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.ui-component.html',
  styleUrls: ['./chatbox.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatboxUiComponent extends ObservableState<State> {
  @InputState()
  private readonly inputState$!: Observable<ChatboxInputState>;

  @Input() public sidebarOpen = false;
  @Input() public sendOnEnter = false;
  @Output() public readonly newMessage = new EventEmitter<string>();
  @Output() public readonly toggleSendOnEnter = new EventEmitter();

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'sidebarOpen',
    'sendOnEnter',
    'message'
  ]).pipe(
    map(({ sidebarOpen, sendOnEnter, message }) => ({
      sidebarOpen,
      message,
      sendOnEnter,
      showSendOnEnterCheckbox: message.length > 0
    }))
  );

  constructor() {
    super();
    this.initialize(
      {
        ...getDefaultInputState(this),
        message: ''
      },
      this.inputState$
    );
  }

  public onTextAreaInput(): void {
    const textarea = document.getElementById('chatbox');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  public onSend(): void {
    this.newMessage.emit(this.snapshot.message);
    this.patch({ message: '' });
  }

  public updateMessage(message: string): void {
    // When send on enter is enabled, we want to send the message when the user presses enter
    if (
      this.snapshot.sendOnEnter &&
      message.charAt(message.length - 1) === '\n'
    ) {
      this.patch({ message: message.slice(0, -1) });
      this.onSend();
    } else {
      this.patch({ message });
    }
  }

  public onSendOnEnterChanged(): void {
    this.toggleSendOnEnter.emit();
  }
}
