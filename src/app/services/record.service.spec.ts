import { TestBed } from '@angular/core/testing';
import { RecordService } from './record.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('RecordService', () => {
  let service: RecordService;
  let firestoreMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jasmine.createSpy().and.callFake(() => ({
        add: jasmine.createSpy().and.returnValue(Promise.resolve('success'))
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        RecordService,
        { provide: AngularFirestore, useValue: firestoreMock }
      ]
    });

    service = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a record successfully', async () => {
    const recordInfo = { name: 'Player1', scores: 100 };
    const result = await service.addRecord(recordInfo);

    expect(firestoreMock.collection).toHaveBeenCalledWith('records');
    // expect(firestoreMock.collection().add).toHaveBeenCalledWith(recordInfo);
    expect(result).toBe('success');
  });

});
