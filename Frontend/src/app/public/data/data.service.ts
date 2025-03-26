import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../../../config';

export type BusinessBasicData = {
  name: string;
  phoneNumber: string;
  email: string;
}

export type ClientOpinion = {
  name: string;
  dietName: string;
  opinion: string;
};

export type CateringType = {
  name: string;
  description: string;
  url: string;
};

export type CateringPrice = {
  kcal: number;
  price: number;
}


export type Order = {
  Email: string;
  Name: string;
  Surname: string;
  DateStart: string; 
  DateEnd: string; 
  City: string;
  Address: string;
  Kcal: number;
  CateringName: string;
  Price: number;
}

export type Site = {
  name: string;
  text: string;
  priority: number;
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private businessBasicData = {
    name: "Serwis",
    phoneNumber: "Serwis",
    email: "Serwis@Firma.com"
  }  
  getbusinessBasicData(){
    return this.businessBasicData
  }

  private clientOpinion: ClientOpinion[] = []
  getClientOpinion(id: number){
    return this.clientOpinion[id]
  }

  private cateringTypes: CateringType[] = []
  getCateringTypes(){
    return this.cateringTypes
  }

  private sites: Site[] = [
    {
      name: "Home",
      text: "Welcome to the homepage!",
      priority: 1
    }
    ]  
  getSites(){
    return this.sites
  }

  getSite(name: string){
    return this.sites.find(x => x.name === name)
  }

  getDetails(name: string){
    return this.cateringTypes.find(x => x.name === name)
  }

  protected navigation = 
    [ "Oferta", "O firmie", "Kontakt"]

  getnavigation(){
    return this.sites
  }

  changenav(){
    this.navigation = [ "Oferta", "Kntakt"]
  }

  httpGetBusinessBasicData(){
    return this.http.get<BusinessBasicData>(`${API_URL}/api/Public/BusinessBasicData`).pipe(tap( {next: (x) => {this.businessBasicData = x}}))
  }

  
  httpGetClientOpinions(){
    return this.http.get<ClientOpinion[]>(`${API_URL}/api/Public/ClientOpinions`).pipe(tap( {next: (x) => {this.clientOpinion = x}}))
  }

  httpGetCateringTypes(){
    return this.http.get<CateringType[]>(`${API_URL}/api/Public/CateringTypes`).pipe(tap( {next: (x) => {this.cateringTypes = x}}))
  }

  httpGetSites(){
    return this.http.get<Site[]>(`${API_URL}/api/Public/Sites`).pipe(tap( {next: (x) => {this.sites = x}}))
  }

  httpGetCateringPrice(cateringName : String){
    return this.http.get<CateringPrice[]>(`${API_URL}/api/Public/CateringTypes/${cateringName}/CateringPrices`)
  }

  httpAddOrder(order : Order){
    return this.http.post(`${API_URL}/api/Public/CreateOrder`, order)
  }

  constructor(private http: HttpClient) {}
}
