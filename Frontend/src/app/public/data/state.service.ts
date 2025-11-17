import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  siteName = ""
  cateringTypeName = ""
  cateringDetailsName = ""
  showContactForm = false
  showClientOrders = false

  getmainSiteVisible(){
    if(this.siteName === "" && this.cateringTypeName === "" && this.cateringDetailsName === "" && !this.showContactForm && !this.showClientOrders)
      return true
    return false
  }

  setmainSiteVisible(){
    this.siteName = ""
    this.cateringTypeName = ""
    this.cateringDetailsName = ""
    this.showContactForm = false
    this.showClientOrders = false
  }

  getCateringName(){
    return this.cateringTypeName
  }

  setCateringType(name: string){
    this.cateringTypeName = name
    this.siteName = ""
    this.cateringDetailsName = ""
    this.showClientOrders = false
  }

  getCateringDetails(){
    return this.cateringDetailsName
  }

  setCateringDetails(name: string){
    this.cateringTypeName = ""
    this.siteName = ""
    this.cateringDetailsName = name
    this.showClientOrders = false
  }

  getSiteName(){
    return this.siteName
  }

  setSite(name: string){
    this.cateringTypeName = ""
    this.cateringDetailsName = ""
    this.siteName = name
    this.showContactForm = false
    this.showClientOrders = false
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
      this.showClientOrders = false
    }
  }

  getShowClientOrders(){
    return this.showClientOrders
  }

  setShowClientOrders(show: boolean){
    this.showClientOrders = show
    if(show){
      this.siteName = ""
      this.cateringTypeName = ""
      this.cateringDetailsName = ""
      this.showContactForm = false
    }
  }

}
