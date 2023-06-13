import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginator } from 'src/app/app.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(public http:HttpClient  ) { }
  public url =  'https://localhost:44348/api/'  ; 

  public getAllCategorys() {
    return this.http.get<any>(this.url + 'Categorys/GetAllCategorys');
  } 
  public getCategoryById(id :any) {
    return this.http.get<any>(this.url + 'Categorys/GetCategoryByID?ID='+id);
  } 


  public getMenuItemsByCategoryId(categoryId:any,paginator  :Paginator ) {
    return this.http.post<any>(this.url + 'MenuItems/GetMenuItemsByCategoryId',{CategoryId:categoryId , paginator:paginator});
  } 

  
}
