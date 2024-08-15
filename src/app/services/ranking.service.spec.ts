import { TestBed } from '@angular/core/testing';
import { RankingService } from './ranking.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('RankingService', () => {
  let service: RankingService;
  let firestoreMock: any;

  beforeEach(() => {
    // Mock Firestore collection
    firestoreMock = {
      collection: jasmine.createSpy().and.callFake((path, queryFn) => ({
        get: jasmine.createSpy().and.returnValue(of({
          docs: [
            { data: () => ({ name: 'Player1', scores: 100 }) },
            { data: () => ({ name: 'Player2', scores: 90 }) }
          ]
        })),
        valueChanges: jasmine.createSpy().and.returnValue(of([
          { name: 'Player1', scores: 100 },
          { name: 'Player2', scores: 90 }
        ]))
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        RankingService,
        { provide: AngularFirestore, useValue: firestoreMock }
      ]
    });

    service = TestBed.inject(RankingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the ranking list', () => {
    const limit = 10;
    const rankingList = service.getRanking(limit);

    expect(firestoreMock.collection).toHaveBeenCalledWith('records', jasmine.any(Function));
    expect(rankingList).toEqual([
      { name: 'Player1', scores: 100 },
      { name: 'Player2', scores: 90 }
    ]);
  });

  it('should get updates as an Observable', (done) => {
    const limit = 10;
    const updates$ = service.getUpdates(limit);

    updates$.subscribe((data) => {
      // expect(firestoreMock.collection).toHaveBeenCalledWith('records', jasmine.any(Function));
      // expect(firestoreMock.collection().valueChanges).toHaveBeenCalled();
      expect(data).toEqual([
        { name: 'Player1', scores: 100 },
        { name: 'Player2', scores: 90 }
      ]);
      done();
    });
  });
});
