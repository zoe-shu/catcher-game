import { Component, HostListener } from '@angular/core';
import { RecordService } from '../services/record.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

  nameInput: string = '';
  scores: number = 0;

  catcher: any;
  catcherAreaWidth: number;
  catcherAreaHeight: number;
  catcherAreaTop: any;

  gameTime: number = 60;
  preStart: any = 3;
  dropDuration: number = 4000;

  isMobile: boolean = false;
  isGameStarted: boolean = false;
  isGameEnded: boolean = false;
  isShowInput: boolean = false;
  isShowRanking: boolean = false;
  onRequestFetchData:boolean = false;

  constructor(
    private recordService: RecordService
  ) {}

  ngOnInit() {
    this.isMobileDevice();
    this.catcher = document.getElementById('catcher');
    this.catcherAreaTop = document.getElementById('catcher-area')?.offsetTop;
    this.catcherAreaWidth = window.innerWidth;
    this.onCountPreStart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileDevice();
    this.catcherAreaTop = document.getElementById('catcher-area')?.offsetTop;
    this.catcherAreaWidth = window.innerWidth;
    this.catcher.style.left = '0px';
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove($event) {
    if(!this.isMobile){
      if($event.clientX < this.catcherAreaWidth && $event.clientX > 0 && $event.clientY > this.catcherAreaTop){
        //limit catcher can move to left or right only
        this.catcher.style.left = $event.clientX + 'px';
      }
  
      if(this.catcher.style.left > this.catcherAreaWidth || this.catcher.style.left < 0){
        this.catcher.style.left = 0;
      }
    }
  }

  isMobileDevice() {
    // Check if mobile
    const root = document.getElementsByTagName('html')[0];
    if("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.maxTouchPoints > 0){
      root.classList.add('mobile');
      root.classList.remove('desktop');
      this.isMobile = true;
    }else {
      root.classList.remove('mobile');
      root.classList.add('desktop');
      this.isMobile = false;
    }
  }

  onResetTimer(){
    this.gameTime = 60;
    this.preStart = 3;
  }

  onResetScores(){
    this.scores = 0;
  }
 
  onGameStarted(){
    this.isGameStarted = true;
    this.onRequestFetchData = false;
  }

  onGameEnded(){
    this.isGameStarted = false;
    this.isGameEnded = true;
    setTimeout(() => {
      this.isShowInput = true;
    }, 1000);
    for (let i in this.itemList){
      this.onResetDropItems(i);
    }
  }

  onCountPreStart(){
    this.onResetTimer();
    let count = this.preStart;

    for(let i = 1; i < count; i++){
      setTimeout(() => {
        this.preStart--; //count 3,2,1 before start
        if(this.preStart == 1){
          setTimeout(() => {
            this.onCountPlayingTime();
          }, 1000);
        }
      }, 1000 * i);
    }
  }

  onCountPlayingTime(){
    let count = this.gameTime;
    this.onGameStarted();
    for(let i = 1; i <= count; i++){ 
      setTimeout(() => {
        let itemIds = Object.keys(this.itemList);
        let randomItem:any;
        
        do{
          randomItem = Math.round(itemIds.length * Math.random() << 0); //pick random item
          randomItem = itemIds[randomItem];
        } while(this.itemList[randomItem].move) //prevent on-screen item was picked

        this.onDropItems(randomItem);
        this.gameTime--; //countdown from 60s

        if(this.gameTime == 0){
          setTimeout(() => {
            this.onGameEnded();
            this.preStart = 'END';
          }, 1000);
        }
      }, 1000 * i);   
    }
  }

  onResetDropItems(item){
    this.itemList[item].catched = false;
    this.itemList[item].move = false;
    this.itemList[item].hide = true;
    let randomXaxis = Math.floor(Math.random() * 91) + '%'; // left: 0-90%
    this.itemList[item].left = randomXaxis;
  }

  onDropItems(item){
    this.itemList[item].hide = false;
    this.itemList[item].move = true;

    this.itemList[item].timeoutID = setTimeout(() => {
      this.onResetDropItems(item); //reset item after move finished
    }, this.dropDuration);
  }

  onCatchItems(item){ //while item was clicked or hovered
    let itemHeight = document.getElementById(item)?.offsetHeight ?? 0;
    let itemTop = document.getElementById(item)?.offsetTop ?? 0;
    let itemBottom = itemHeight + itemTop;

    if(!this.itemList[item].catched && this.isGameStarted && itemBottom >= this.catcherAreaTop ){
      this.scores += this.itemList[item].points;
      this.itemList[item].catched = true;
      clearTimeout(this.itemList[item].timeoutID);
      this.itemList[item].timeoutI = undefined;
      this.onResetDropItems(item);
    }
  }

  onSubmitRecord(){
    this.recordService.addRecord({'scores': this.scores, 'name': this.nameInput}).then(() => {
      this.isShowRanking = true;
      this.isGameEnded = false;
      this.isShowInput = false;
      this.onRequestFetchData = true; //get updated top 10 leaderboard
    });
  }


  itemList = {
    'e1': {
      'catched': false,
      'points': 50,
      'left': '90%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
    'e2': {
      'catched': false,
      'points': 50,
      'left': '5%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
    'p1': {
      'catched': false,
      'points': 50,
      'left': '60%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
    'p2': {
      'catched': false,
      'points': 50,
      'left': '30%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
    'p3': {
      'catched': false,
      'points': 50,
      'left': '40%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
    'p4': {
      'catched': false,
      'points': 50,
      'left': '45%',
      'hide': true,
      'move': false,
      'timeoutID': undefined,
    },
  };
}
