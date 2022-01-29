import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number):Observable<number[]>{
    let data:number[] =[]
    //build array for "month" dropdown list
    //--start at current month and loop until 12 months

    for (let theMonth = startMonth; theMonth <=12; theMonth ++){
      data.push(theMonth)
    }
    return of(data)
  }

  getCreditCardYears(): Observable<number[]> {
    let data:number [] = []
    //build array for "month" dropdown list
    //--start at current month and loop until
    const startYear: number = new Date().getFullYear()
    const endYear: number = startYear + 10
    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear)
    }
    return of(data)
  }


}
