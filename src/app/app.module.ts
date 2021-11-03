import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CoordsComponent } from './coords/coords.component';
import { GoogleMapDirective } from './google-map.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CoordsComponent,
    GoogleMapDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
