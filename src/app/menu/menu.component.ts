import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { EMPTY, Observable, UnaryFunction } from 'rxjs';
import { IFonctionnalites } from '../modele/fonctionnalites';
import { IMenus } from '../modele/menus';
import { MenusService } from '../services/menus/menus.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges {
  menuUser$:Observable<IMenus>=EMPTY;
  fonctionnalites!: IFonctionnalites[];
  @Input()
  langueParent :string = 'fr';
  userId !:any;
  constructor(private menuService:MenusService ) { }

  ngOnInit(): void {
    if(localStorage.getItem("userId")!=null){
      this.userId = localStorage.getItem("userId");
    }else{
      this.userId = "phil";
    }
    this.menuUser$ = this.getMenus();
    this.menuUser$.subscribe(x=>{
      if(x!=null && x.fonctionnalites!=null){
        this.fonctionnalites = x.fonctionnalites;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ok');
    if(changes['langueParent'] && changes['langueParent'].currentValue){
      console.log('lanuge parent ', changes);
      this.menuUser$ = this.getMenus();
      this.menuUser$.subscribe(x=>{
        if(x!=null  && x.fonctionnalites!=null){
          this.fonctionnalites = x.fonctionnalites;
        }

      })
    }
    
  }

  private getMenus(){
    return  this.menuService.getMenuByUserAndLangue(this.userId,this.langueParent);
  } 
}
