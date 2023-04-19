import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ChatboxUiComponent } from '../../ui/chatbox/chatbox.ui-component';
import { AppInfoUiComponent } from '../../ui/app-info/app-info.ui-component';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { Chat, Message } from '@ameliorated-chat/shared/type-chat';
import { FacadeService } from '../../../facade.service';
import { map, Observable, pipe } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatMessageUiComponent } from '../../ui/chat-message/chat-message.ui-component';
import { ApiKeyInputDialogComponent } from '../../ui/api-key-input-dialog/api-key-input-dialog.component';
import { ProfilePicInputDialogComponent } from '../../ui/profile-pic-input-dialog/profile-pic-input-dialog.component';

type ViewModel = {
  chat: Chat | null;
  inputApiKeyDialogVisible: boolean;
  userProfilePicDialogVisible: boolean;
  showInputApiKey: boolean;
  openAIApiKey: string;
  userProfilePicUrl: string;
};

type State = {
  chat: Chat | null;
  chats: Chat[];
  currentChatId: string;
  inputApiKeyDialogVisible: boolean;
  userProfilePicDialogVisible: boolean;
  openAIApiKey: string;
  userProfilePicUrl: string;
};

@Component({
  selector: 'ac-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatboxUiComponent,
    AppInfoUiComponent,
    ChatMessageUiComponent,
    ApiKeyInputDialogComponent,
    ProfilePicInputDialogComponent
  ],
  templateUrl: './chat.smart-component.html',
  styleUrls: ['./chat.smart-component.scss']
})
export class ChatSmartComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);

  public readonly vm$: Observable<ViewModel> = this.onlySelectWhen([
    'chat',
    'inputApiKeyDialogVisible',
    'userProfilePicDialogVisible',
    'openAIApiKey',
    'userProfilePicUrl'
  ]).pipe(
    map(
      ({
        chat,
        inputApiKeyDialogVisible,
        openAIApiKey,
        userProfilePicUrl,
        userProfilePicDialogVisible
      }) => ({
        chat,
        inputApiKeyDialogVisible,
        showInputApiKey: openAIApiKey.length === 0,
        openAIApiKey,
        userProfilePicUrl,
        userProfilePicDialogVisible
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
      openAIApiKey: this.chatObservableState.snapshot.openAIApiKey,
      userProfilePicUrl: this.chatObservableState.snapshot.userProfilePicUrl
    });

    const currentChatId$ = this.activatedRoute.params.pipe(
      map((params) => params['id'])
    );

    this.connect({
      ...this.chatObservableState.pick([
        'chats',
        'openAIApiKey',
        'inputApiKeyDialogVisible',
        'userProfilePicUrl'
      ]),
      currentChatId: currentChatId$,
      chat: this.onlySelectWhen(['chats', 'currentChatId']).pipe(mapToChat())
    });
  }

  public newChatMessage(message: string): void {
    if (this.snapshot.openAIApiKey.length === 0) {
      this.openInputApiKeyDialog();
      return;
    }

    this.chatObservableState.newChatMessage(
      message,
      this.snapshot.currentChatId
    );

    const messages: Message[] =
      this.chatObservableState.snapshot.chats.find(
        (chat) => chat.id === this.snapshot.currentChatId
      )?.messages || [];

    if (messages.length > 0) {
      this.facade.newChatMessage(messages).subscribe((answer) => {
        this.chatObservableState.newChatMessage(
          answer,
          this.snapshot.currentChatId,
          'assistant'
        );
        this.viewportScroller.scrollToPosition([0, 9999999]);
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
}

const mapToChat = () =>
  pipe(
    map(
      ({ currentChatId, chats }: { currentChatId: string; chats: Chat[] }) =>
        chats.find((chat) => chat.id === currentChatId) || null
    )
  );
