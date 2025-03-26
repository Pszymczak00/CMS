import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  siteName = ""
  cateringTypeName = ""
  cateringDetailsName = ""

  getmainSiteVisible(){
    if(this.siteName === "" && this.cateringTypeName === "" && this.cateringDetailsName === "")
      return true
    return false
  }

  setmainSiteVisible(){
    this.siteName = ""
    this.cateringTypeName = ""
    this.cateringDetailsName = ""
  }

  getCateringName(){
    return this.cateringTypeName
  }

  setCateringType(name: string){
    this.cateringTypeName = name
    this.siteName = ""
    this.cateringDetailsName = ""
  }

  getCateringDetails(){
    return this.cateringDetailsName
  }

  setCateringDetails(name: string){
    this.cateringTypeName = ""
    this.siteName = ""
    this.cateringDetailsName = name
  }

  getSiteName(){
    return this.siteName
  }

  setSite(name: string){
    this.cateringTypeName = ""
    this.cateringDetailsName = ""
    this.siteName = name
  }

}
