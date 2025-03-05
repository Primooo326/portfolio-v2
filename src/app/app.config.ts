import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ModalService } from './services/modal.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), ModalService]
};
