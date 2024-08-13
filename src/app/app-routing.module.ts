import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', 
    loadChildren: () => import('./game/game.module').then(m => m.GameModule) 
  }, 
  { path: 'leaderboard', 
    loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
