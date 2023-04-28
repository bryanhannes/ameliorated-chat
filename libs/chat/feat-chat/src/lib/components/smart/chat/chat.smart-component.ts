import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ChatboxUiComponent } from '../../ui/chatbox/chatbox.ui-component';
import { AppInfoUiComponent } from '../../ui/app-info/app-info.ui-component';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat, Message } from '@ameliorated-chat/chat/type-chat';
import { FacadeService } from '../../../facade.service';
import { map, Observable, pipe, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessageUiComponent } from '../../ui/chat-message/chat-message.ui-component';
import { ApiKeyInputDialogUiComponent } from '../../ui/api-key-input-dialog/api-key-input-dialog.ui-component';
import { ProfilePicInputDialogUiComponent } from '../../ui/profile-pic-input-dialog/profile-pic-input-dialog.ui-component';
import { generateUUID } from '@ameliorated-chat/frontend/util-uuid';
import { getCurrentId } from '../../../utils/current-id.util';
import { ModelSettingsDialogUiComponent } from '../../ui/model-settings-dialog/model-settings-dialog.ui-component';

type ViewModel = {
  chat: Chat | null;
  inputApiKeyDialogVisible: boolean;
  userProfilePicDialogVisible: boolean;
  systemOptionsDialogVisible: boolean;
  showInputApiKey: boolean;
  openAIApiKey: string;
  userProfilePicUrl: string;
  sendOnEnter: boolean;
  sidebarOpen: boolean;
};

type State = {
  chat: Chat | null;
  chats: Chat[];
  currentChatId: string;
  inputApiKeyDialogVisible: boolean;
  userProfilePicDialogVisible: boolean;
  systemOptionsDialogVisible: boolean;
  openAIApiKey: string;
  userProfilePicUrl: string;
  sendOnEnter: boolean;
  sidebarOpen: boolean;
};

@Component({
  selector: 'ac-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatboxUiComponent,
    AppInfoUiComponent,
    ChatMessageUiComponent,
    ApiKeyInputDialogUiComponent,
    ProfilePicInputDialogUiComponent,
    ModelSettingsDialogUiComponent
  ],
  templateUrl: './chat.smart-component.html',
  styleUrls: ['./chat.smart-component.scss']
})
export class ChatSmartComponent extends ObservableState<State> {
  private readonly router = inject(Router);
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  public readonly vm$: Observable<ViewModel> = this.onlySelectWhen([
    'chat',
    'inputApiKeyDialogVisible',
    'userProfilePicDialogVisible',
    'openAIApiKey',
    'userProfilePicUrl',
    'sendOnEnter',
    'sidebarOpen',
    'systemOptionsDialogVisible'
  ]).pipe(
    map(
      ({
        chat,
        inputApiKeyDialogVisible,
        openAIApiKey,
        userProfilePicUrl,
        userProfilePicDialogVisible,
        sendOnEnter,
        sidebarOpen,
        systemOptionsDialogVisible
      }) => ({
        chat,
        inputApiKeyDialogVisible,
        showInputApiKey: openAIApiKey.length === 0,
        openAIApiKey,
        userProfilePicUrl,
        userProfilePicDialogVisible,
        sendOnEnter,
        sidebarOpen,
        systemOptionsDialogVisible
      })
    )
  );

  public readonly tracker = (i: number) => i;

  constructor() {
    super();
    this.initialize({
      chat: null,
      chats: [],
      currentChatId: this.activatedRoute.snapshot.params['id'],
      inputApiKeyDialogVisible: false,
      userProfilePicDialogVisible: false,
      systemOptionsDialogVisible: false,
      openAIApiKey: this.chatObservableState.snapshot.openAIApiKey,
      userProfilePicUrl: this.chatObservableState.snapshot.userProfilePicUrl,
      sendOnEnter: this.chatObservableState.snapshot.sendOnEnter,
      sidebarOpen: this.chatObservableState.snapshot.sidebarOpen
    });

    const currentChatId$ = getCurrentId(this.router, this.activatedRoute);

    this.connect({
      ...this.chatObservableState.pick([
        'chats',
        'openAIApiKey',
        'inputApiKeyDialogVisible',
        'userProfilePicUrl',
        'sendOnEnter',
        'sidebarOpen'
      ]),
      currentChatId: currentChatId$,
      chat: this.onlySelectWhen(['chats', 'currentChatId']).pipe(
        mapToChat(),
        tap(console.log)
      )
    });
  }

  public newChatMessage(message: string): void {
    if (this.snapshot.openAIApiKey.length === 0) {
      this.openInputApiKeyDialog();
      return;
    }

    if (!this.snapshot.currentChatId) {
      const uuid = generateUUID();
      this.chatObservableState.newChat(uuid);
      this.patch({ currentChatId: uuid });
      this.router.navigate([uuid]).then(() => this.addNewChatMessage(message));
    } else {
      this.addNewChatMessage(message);
    }
  }

  public addNewChatMessage(message: string): void {
    this.chatObservableState.newChatMessage(
      message,
      this.snapshot.currentChatId
    );

    const messages: Message[] =
      this.chatObservableState.snapshot.chats.find(
        (chat) => chat.id === this.snapshot.currentChatId
      )?.messages || [];

    if (messages.length > 0) {
      this.facade.newChatMessage(messages).subscribe({
        next: (chunk) => {
          this.chatObservableState.newChatMessageChunk(
            chunk,
            this.snapshot.currentChatId
          );
          this.viewportScroller.scrollToPosition([0, 9999999]);
        },
        error: (error) => console.error(error),
        complete: () => this.generateTitleForNewChat(message)
      });
    }
  }

  private generateTitleForNewChat(message: string) {
    const messagesOfCurrentChat = this.chatObservableState.snapshot.chats.find(
      (chat) => chat.id === this.snapshot.currentChatId
    )?.messages;

    // First call has a message size of 3: 1 system message, 1 user message and 1 assistant message
    if (messagesOfCurrentChat && messagesOfCurrentChat.length === 3) {
      const userMessage = message;
      const assistantMessage = this.chatObservableState.snapshot.chats
        .find((chat) => chat.id === this.snapshot.currentChatId)
        ?.messages.slice(-1)[0].content;

      if (!assistantMessage) return;

      this.facade
        .generateTitleForChat(userMessage, assistantMessage)
        .subscribe({
          next: (chunk) => {
            console.log(chunk);
            this.chatObservableState.newChatTitleChunk(
              chunk,
              this.snapshot.currentChatId
            );
          },
          error: (error) => console.error(error)
        });
    }
  }

  public openInputApiKeyDialog(): void {
    this.chatObservableState.openInputApiKeyDialog();
  }

  public closeInputApiKeyDialog(): void {
    this.chatObservableState.closeInputApiKeyDialog();
  }

  public setApiKey(apiKey: string): void {
    this.chatObservableState.setOpenApiKey(apiKey);
    this.closeInputApiKeyDialog();
  }

  public openUserProfileDialog(): void {
    this.patch({ userProfilePicDialogVisible: true });
  }

  public closeUserProfileDialog(): void {
    this.patch({ userProfilePicDialogVisible: false });
  }

  public setProfilePic(url: string): void {
    this.chatObservableState.setUserProfilePicUrl(url);
    this.closeUserProfileDialog();
  }

  public toggleSendOnEnter(): void {
    this.chatObservableState.toggleSendOnEnter();
  }

  public openSystemOptionsDialog(): void {
    this.patch({ systemOptionsDialogVisible: true });
  }

  public closeSystemOptionsDialog(): void {
    this.patch({ systemOptionsDialogVisible: false });
  }

  public modelChanged(model: string): void {
    this.chatObservableState.setModelForChat(
      model,
      this.snapshot.currentChatId
    );
  }

  public temperatureChanged(temperature: number): void {
    this.chatObservableState.setTemperatureForChat(
      temperature,
      this.snapshot.currentChatId
    );
  }

  public initialSystemInstructionChanged(
    initialSystemInstruction: string
  ): void {
    this.chatObservableState.setInitialSystemInstructionForChat(
      initialSystemInstruction,
      this.snapshot.currentChatId
    );
  }
}

const mapToChat = () =>
  pipe(
    map(
      ({ currentChatId, chats }: { currentChatId: string; chats: Chat[] }) =>
        chats.find((chat) => chat.id === currentChatId) || null
    )
  );
