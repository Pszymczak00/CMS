import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  siteName = "Podstawowe dane"
  siteNumber = 0


  getSite(){
    return this.siteName
  }

  setSite(name: string){
    this.siteName = name
  }

  getNumber(){
    return this.siteNumber
  }

  setNumber(number: number){
    this.siteNumber = number
  }

}
