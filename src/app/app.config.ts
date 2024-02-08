import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyCMu1LSE3pmBz2BgUFNMoC5sUJon1peWdI",
    authDomain: "webcam-recorder-d5ef6.firebaseapp.com",
    projectId: "webcam-recorder-d5ef6",
    storageBucket: "webcam-recorder-d5ef6.appspot.com",
    messagingSenderId: "1010665342769",
    appId: "1:1010665342769:web:33321adc131a10711ad210"
 }
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"webcam-recorder-d5ef6","appId":"1:1010665342769:web:33321adc131a10711ad210","storageBucket":"webcam-recorder-d5ef6.appspot.com","apiKey":"AIzaSyCMu1LSE3pmBz2BgUFNMoC5sUJon1peWdI","authDomain":"webcam-recorder-d5ef6.firebaseapp.com","messagingSenderId":"1010665342769"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
