import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { ChatFeatShellComponent } from './chat-feat-shell/chat-feat-shell.component';
import { ChatSmartComponent } from '@ameliorated-chat/chat/feat-chat';
import { inject } from '@angular/core';
import { getFromLocalStorage } from '@ameliorated-chat/frontend/util-local-storage';
import { Chat } from '@ameliorated-chat/chat/type-chat';

const hasValidId = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const chats: Chat[] = getFromLocalStorage('chats');
  const chatId = activatedRouteSnapshot.params['id'];
  const foundChat = chats.some((chat) => chat.id === chatId);

  if (!foundChat) {
    const router = inject(Router);
    router.navigateByUrl('/');
  }

  return foundChat;
};

export const chatFeatShellRoutes: Route[] = [
  {
    path: '',
    component: ChatFeatShellComponent,
    children: [
      {
        path: ':id',
        component: ChatSmartComponent,
        canActivate: [hasValidId]
      },
      {
        path: '',
        component: ChatSmartComponent
      }
    ]
  }
];
