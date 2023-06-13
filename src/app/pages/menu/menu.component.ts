import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, map } from 'rxjs/operators';
import { MenuItem, Pagination, Paginator } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen:boolean = false;
  public showSidenavToggle:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public menuItems: MenuItem[] = [];
  public categories:any[] = [];
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public count: number = 10;
  public sort: string = '';
  public selectedCategoryId:number = 0;
  public pagination:Pagination = new Pagination(1, this.count, null, 2, 0, 0); 
  public message:string | null = '';
  public watcher: Subscription;
  public settings: Settings;
  public paginators:Paginator = new Paginator(1,this.count,0); 

  constructor(public appSettings:AppSettings, public appService:AppService,public menuService: MenuService, public mediaObserver: MediaObserver) {
    this.settings = this.appSettings.settings; 
    this.watcher = mediaObserver.asObservable()
    .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
    .subscribe((change: MediaChange) => {
      if(change.mqAlias == 'xs') {
        this.sidenavOpen = false;
        this.showSidenavToggle = true;
        this.viewCol = 100;
      }
      else if(change.mqAlias == 'sm'){
        this.sidenavOpen = false;
        this.showSidenavToggle = true;
        this.viewCol = 50;
      }
      else if(change.mqAlias == 'md'){
        this.sidenavOpen = false;
        this.showSidenavToggle = false;
        this.viewCol = 33.3;
      }
      else{
        this.sidenavOpen = false;
        this.showSidenavToggle = false;
        this.viewCol = 25;
      }
    });


  }

  ngOnInit(): void {
    this.getCategories();
    this.getMenuItems();
  }

  ngOnDestroy(){ 
    this.watcher.unsubscribe();
  }

  public getCategories(){
    this.menuService.getAllCategorys().subscribe(categories=>{
      this.categories = categories.data;
    })
  } 
  public selectCategory(id:number){
    this.selectedCategoryId = id;
    this.menuItems.length = 0;
    this.resetPagination();
    this.getMenuItems();
    this.sidenav.close();
  }
  public onChangeCategory(event:any){ 
    this.selectCategory(event.value);
  }

  public getMenuItems(){
    this.menuService.getMenuItemsByCategoryId(this.selectedCategoryId,this.paginators).subscribe(data => {
      console.log(data)
      if(data.total == 0){
        this.menuItems.length = 0;
        this.paginators =  new Paginator(1,this.count,0);  
        this.message = 'No Results Found'; 
      } 
      else{
        this.menuItems = data.items; 
        this.paginators.total = data.total  
        this.message = null;
      } 
    })
  }  

  public resetPagination(){ 
    if(this.paginator){
      this.paginator.pageIndex = 0;
    }
    this.paginators = new Paginator(1, this.count, this.paginators.total );
  }

  public filterData(data:any){
    return this.appService.filterData(data, this.selectedCategoryId, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public changeCount(count:number){
    this.count = count;   
    this.menuItems.length = 0;
    this.resetPagination();
    this.getMenuItems();
  }
  public changeSorting(sort:any){    
    this.sort = sort; 
    this.menuItems.length = 0;
    this.getMenuItems();
  }
  public changeViewType(obj:any){ 
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol; 
  } 


  public onPageChange(e:any){ 
    this.paginators.page = e.pageIndex + 1;
    this.getMenuItems();
    window.scrollTo(0,0);  
  }

} 