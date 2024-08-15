import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { RecordService } from '../services/record.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { FormsModule } from '@angular/forms';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let recordService: jasmine.SpyObj<RecordService>;

  beforeEach(async () => {
    const recordServiceSpy = jasmine.createSpyObj('RecordService', ['addRecord']);

    await TestBed.configureTestingModule({
      declarations: [GameComponent],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
      ],
      imports:[
        LeaderboardModule,
        FormsModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    recordService = TestBed.inject(RecordService) as jasmine.SpyObj<RecordService>;
    fixture.detectChanges(); // triggers ngOnInit()
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize game and catcher area on ngOnInit', () => {
    spyOn(component, 'onCountPreStart');
    component.ngOnInit();
    
    expect(component.catcherAreaTop).toBeDefined();
    expect(component.catcherAreaWidth).toEqual(window.innerWidth);
    expect(component.onCountPreStart).toHaveBeenCalled();
  });

  it('should update catcher position on window resize', () => {
    component.ngOnInit();
    spyOn(component, 'onResize').and.callThrough();

    window.dispatchEvent(new Event('resize'));
    expect(component.onResize).toHaveBeenCalled();
    expect(component.catcherAreaWidth).toEqual(window.innerWidth);
  });

  it('should start the game when preStart count reaches zero', (done) => {
    spyOn(component, 'onGameStarted');
    component.onCountPreStart();

    setTimeout(() => {
      // expect(component.preStart).toEqual('START');
      expect(component.onGameStarted).toHaveBeenCalled();
      done();
    }, 4000); // Considering 3-second countdown
  });

  it('should reset timer and scores', () => {
    component.onResetTimer();
    expect(component.gameTime).toEqual(60);
    expect(component.preStart).toEqual(3);

    component.onResetScores();
    expect(component.scores).toEqual(0);
  });

  it('should drop items during the game', (done) => {
    spyOn(component, 'onDropItems').and.callThrough();
    component.gameTime = 2; // shorten time for testing

    component.onCountPlayingTime();

    setTimeout(() => {
      expect(component.onDropItems).toHaveBeenCalled();
      done();
    }, 2000); // Checking drop within the reduced time frame
  });

});
