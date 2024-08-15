import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from 'src/environment';


@NgModule({
  declarations: [
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    provideFirebaseApp(
      () => initializeApp(environment.firebase)), 
      provideAuth(() => getAuth()), 
      provideFirestore(() => getFirestore(),
    ),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  exports: [
    LeaderboardComponent
  ]
})
export class LeaderboardModule { }
