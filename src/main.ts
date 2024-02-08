import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, environment } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
