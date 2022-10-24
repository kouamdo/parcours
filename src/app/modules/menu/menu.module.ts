import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { ElementInitComponent } from './element-init/element-init/element-init.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';


@NgModule({
  declarations: [
    ElementInitComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule 
  ]
})
export class MenuModule { }
