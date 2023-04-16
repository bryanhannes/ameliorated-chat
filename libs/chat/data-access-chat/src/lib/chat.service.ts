import { inject, Injectable } from '@angular/core';
import { Message } from '@ameliorated-chat/shared/type-chat';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/chat';

  public newChatMessage(messages: Message[]): Observable<string> {
    return this.httpClient.post<string>(
      this.apiUrl,
      {
        messages,
        model: 'gpt-3.5-turbo',
        apiKey: '' // TODO add api key
      },
      { responseType: 'text' as 'json' }
    );
  }
}
