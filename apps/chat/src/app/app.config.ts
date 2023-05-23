import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withEnabledBlockingInitialNavigation
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ChatTitleStrategy } from '@ameliorated-chat/chat/feat-chat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    {
      provide: TitleStrategy,
      useClass: ChatTitleStrategy
    }
  ]
};
