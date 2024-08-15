import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardComponent } from './leaderboard.component';
import { GameRecord } from '../interface/game-record';
import { RankingService } from '../services/ranking.service';
import { of } from 'rxjs';

// Mock data for testing
const mockGameRecords: GameRecord[] = [
  { id: '1', name: 'Player1', scores: 100 },
  { id: '2', name: 'Player2', scores: 90 }
];

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let rankingService: jasmine.SpyObj<RankingService>;

  beforeEach(async () => {
    const rankingServiceSpy = jasmine.createSpyObj('RankingService', ['getRanking', 'getUpdates']);

    await TestBed.configureTestingModule({
      declarations: [LeaderboardComponent],
      providers: [
        { provide: RankingService, useValue: rankingServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    rankingService = TestBed.inject(RankingService) as jasmine.SpyObj<RankingService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize rankingList on ngOnInit', () => {
    rankingService.getRanking.and.returnValue(mockGameRecords);
    rankingService.getUpdates.and.returnValue(of(mockGameRecords));

    component.ngOnInit();

    expect(rankingService.getRanking).toHaveBeenCalledWith(component.limit);
    expect(rankingService.getUpdates).toHaveBeenCalledWith(component.limit);
    expect(component.rankingList).toEqual(mockGameRecords);
  });

  it('should update rankingList when refreshBoard is called', () => {
    rankingService.getRanking.and.returnValue(mockGameRecords);

    component.refreshBoard();

    expect(rankingService.getRanking).toHaveBeenCalledWith(component.limit);
    expect(component.rankingList).toEqual(mockGameRecords);
  });

  it('should call refreshBoard on ngOnChanges if isRequestFetchData is true', () => {
    spyOn(component, 'refreshBoard');
    component.isRequestFetchData = true;

    component.ngOnChanges();

    expect(component.refreshBoard).toHaveBeenCalled();
  });

  it('should not call refreshBoard on ngOnChanges if isRequestFetchData is false', () => {
    spyOn(component, 'refreshBoard');
    component.isRequestFetchData = false;

    component.ngOnChanges();

    expect(component.refreshBoard).not.toHaveBeenCalled();
  });
});