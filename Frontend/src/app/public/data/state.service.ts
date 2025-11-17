import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  siteName = ""
  cateringTypeName = ""
  cateringDetailsName = ""
  showContactForm = false

  getmainSiteVisible(){
    if(this.siteName === "" && this.cateringTypeName === "" && this.cateringDetailsName === "" && !this.showContactForm)
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
    this.showContactForm = false
  }

  getShowContactForm(){
    return this.showContactForm
  }

  setShowContactForm(show: boolean){
    this.showContactForm = show
    if(show){
      this.siteName = ""
      this.cateringTypeName = ""
      this.cateringDetailsName = ""
    }
  }

}
