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
  id: number
  name: string;
  dietName: string;
  opinion: string;
};

export type CateringType = {
  id: number;
  name: string;
  description: string;
  url: string;
};

export type CateringPrice = {
  id: number;
  kcal: number;
  price: number;
}


export type Order = {
  id: number;
  email: string;
  name: string;
  surname: string;
  dateStart: string; 
  dateEnd: string; 
  city: string;
  address: string;
  kcal: number;
  cateringName: string;
  price: number
}

export type Site = {
  id: number
  name: string;
  text: string;
  priority: number;
}

type PostSites = {
  sites: Site[];
  deletedSites: number[];
}

type PostCateringTypes = {
  cateringTypes: CateringType[];
  deletedCateringTypes: number[];
}

type PostCateringPrices = {
  cateringPrices: CateringPrice[];
  deletedCateringPrices: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private businessBasicData: BusinessBasicData[] = []

  httpGetBusinessBasicData(){
    return this.http.get<BusinessBasicData>(`${API_URL}/api/Public/BusinessBasicData`).pipe(tap( {next: (x) => {this.businessBasicData = [x]}}))
  }
  httpPostBusinessBasicData(data :BusinessBasicData){
    return this.http.post<BusinessBasicData[]>(`${API_URL}/api/Private/BusinessBasicData`, data)
  }

  httpGetClientsOpinions(){
    return this.http.get<ClientOpinion[]>(`${API_URL}/api/Private/ClientOpinions`)
  }
  httpPostClientOpinions(data: ClientOpinion[]){
    return this.http.post<ClientOpinion[]>(`${API_URL}/api/Private/ClientOpinions`, data)
  }

  httpGetSites(){
    return this.http.get<Site[]>(`${API_URL}/api/Private/Sites`)
  }

  httpPostSites(data: Site[], deletedSites: number[]){
    let postSites : PostSites = {sites: data, deletedSites: deletedSites}
    return this.http.post<Site[]>(`${API_URL}/api/Private/Sites`, postSites)
  }

  httpGetCateringTypes(){
    return this.http.get<CateringType[]>(`${API_URL}/api/Private/CateringTypes`)
  }

  httpPostCateringTypes(data: CateringType[], deletedSites: number[]){
    let postCateringTypes : PostCateringTypes = {cateringTypes: data, deletedCateringTypes: deletedSites}
    return this.http.post<CateringPrice[]>(`${API_URL}/api/Private/CateringTypes`, postCateringTypes)
  }

  httpGetCateringPrices(id: number){
    return this.http.get<CateringPrice[]>(`${API_URL}/api/Private/CateringPrices/${id}`)
  }

  httpPostCateringPrices(data: CateringPrice[], deletedSites: number[], id: number){
    let postCateringPrices : PostCateringPrices = {cateringPrices: data, deletedCateringPrices: deletedSites}
    return this.http.post<CateringPrice[]>(`${API_URL}/api/Private/CateringPrices/${id}`, postCateringPrices)
  }

  httpGetOrders(){
    return this.http.get<Order[]>(`${API_URL}/api/Private/Orders`)
  }

  constructor(private http: HttpClient) {}
}
