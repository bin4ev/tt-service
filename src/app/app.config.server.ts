import { mergeApplicationConfig, ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig,  } from './app.config';
import { GooglePlaceService } from './core/services/google-place.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
