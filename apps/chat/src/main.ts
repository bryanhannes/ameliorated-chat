import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  TitleStrategy,
  withEnabledBlockingInitialNavigation
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ChatTitleStrategy } from '@ameliorated-chat/chat/feat-chat';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    {
      provide: TitleStrategy,
      useClass: ChatTitleStrategy
    }
  ]
}).catch((err) => console.error(err));
