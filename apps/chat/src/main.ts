import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

import { ChatTitleStrategy } from '@ameliorated-chat/chat/feat-chat';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
