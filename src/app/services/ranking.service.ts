import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  rankingList: any[] = [];

  constructor(private firestore: AngularFirestore) {}  

  getRanking(limit){
    this.rankingList = [];
    this.firestore.collection('records', ref => ref.orderBy('scores', 'desc').limit(limit))
    .get()
    .subscribe((snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.rankingList.push(doc.data());
      });
    });
    return this.rankingList;
  }

  getUpdates(limit): Observable<any>{
    return this.firestore.collection('records', ref => ref.orderBy('scores', 'desc').limit(limit))
    .valueChanges();
  }

}
