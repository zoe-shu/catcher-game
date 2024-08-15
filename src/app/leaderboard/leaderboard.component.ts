import { Component, Input, OnInit } from '@angular/core';
import { GameRecord } from '../interface/game-record';
import { RankingService } from '../services/ranking.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {

  @Input() limit = 100;
  @Input() isRequestFetchData: boolean = false;

  initDataList: any;
  rankingList: GameRecord[] = [];

  constructor(private rankingService: RankingService) {

  }
  ngOnInit() {
    this.rankingList = this.rankingService.getRanking(this.limit);
    this.rankingService.getUpdates(this.limit).subscribe(data => {
      this.rankingList = [];
      data.forEach((doc) => {
        this.rankingList.push(doc);
      });
    });
  }

  refreshBoard(){
    this.rankingList = this.rankingService.getRanking(this.limit);
  }

  ngOnChanges(){
    if(this.isRequestFetchData){
      this.refreshBoard();
    }
  }

}
