import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';  

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private firestore: AngularFirestore) {}

  addRecord(recordInfo) {  
    return this.firestore.collection('records').add(recordInfo).then(() => 'success').catch(err => err);  
  }

}
