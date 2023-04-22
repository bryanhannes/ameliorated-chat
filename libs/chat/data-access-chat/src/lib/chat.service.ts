import { Injectable } from '@angular/core';
import { Message } from '@ameliorated-chat/chat/type-chat';
import { Observable } from 'rxjs';
import { getFromLocalStorage } from '@ameliorated-chat/frontend/util-local-storage';

@Injectable({ providedIn: 'root' })
export class ChatService {
  public newChatMessage(messages: Message[]): Observable<string> {
    const apiKey = getFromLocalStorage('openApiKey');
    const url = 'https://api.openai.com/v1/chat/completions';

    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);

      xhr.onprogress = () => {
        const newUpdates = xhr.responseText
          .replace('data: [DONE]', '')
          .trim()
          .split('data: ')
          .filter(Boolean);

        const newUpdatesParsed: string[] = newUpdates.map((update) => {
          const parsed = JSON.parse(update);
          return parsed.choices[0].delta?.content || '';
        });

        observer.next(newUpdatesParsed.join(''));
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.complete();
          } else {
            observer.error(
              new Error('Request failed with status ' + xhr.status)
            );
          }
        }
      };

      xhr.send(
        JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.5,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true
        })
      );

      return () => {
        xhr.abort();
      };
    });
  }
}
