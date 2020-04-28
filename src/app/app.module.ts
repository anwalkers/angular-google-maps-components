import { NgModule, Inject } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { MapModule } from "./map/map.module";

import { BROWSER_GLOBALS_PROVIDERS } from './utilities/browser-global';
import { MapService } from "./map/services/map.service";
import { GoogleMapsConfig } from './map/maps';

@NgModule({
  imports: [BrowserModule, FormsModule, MapModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [...BROWSER_GLOBALS_PROVIDERS]
})
export class AppModule {
  private mapConfig: GoogleMapsConfig = {
    clientId: '',
    key: '',
    libraries: 'places'
  }

  constructor(@Inject('MapService') private _mapService: MapService ) {
    this._mapService.loadGoogleMap(this.mapConfig);
  }
}
