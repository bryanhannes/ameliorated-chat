import { Route } from '@angular/router';
import { ChatFeatShellComponent } from './chat-feat-shell/chat-feat-shell.component';
import { ChatSmartComponent } from '@ameliorated-chat/chat/feat-chat';

export const chatFeatShellRoutes: Route[] = [
  {
    path: '',
    component: ChatFeatShellComponent,
    children: [
      {
        path: '',
        component: ChatSmartComponent
      },
      {
        path: ':id',
        component: ChatSmartComponent
      }
    ]
  }
];
