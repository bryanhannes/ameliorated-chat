import { inject, Injectable } from '@angular/core';
import { ChatObservableState } from '@ameliorated-chat/chat/data-access-chat-state';
import { Message } from '@ameliorated-chat/chat/type-chat';
import { Observable } from 'rxjs';
import { ChatService } from '@ameliorated-chat/chat/data-access-chat';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {
  public readonly chatObservableState = inject(ChatObservableState);
  private readonly chatService = inject(ChatService);

  public newChatMessage(messages: Message[]): Observable<string> {
    return this.chatService.newChatMessage(messages);
  }

  public generateTitleForChat(
    userMessage: string,
    assistantMessage: string
  ): Observable<string> {
    return this.chatService.generateTitleForChat(userMessage, assistantMessage);
  }
}
