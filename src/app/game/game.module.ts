import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';

import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from 'src/env';
import { FormsModule } from '@angular/forms';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    GameComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    LeaderboardModule,
    DragDropModule,
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  exports: [
    
  ]
})
export class GameModule { }
