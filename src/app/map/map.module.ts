import { NgModule, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map-component/map.component";
import { MapService } from "./services/map.service";
import { MapMarkerComponent } from "./map-marker/map-marker.component";
import { MapInfoWindowComponent } from './map-info-window/map-info-window.component';
import { MapEventManagerService } from "./services/map-event-manager.service";

@NgModule({
  imports: [CommonModule],
  exports: [MapComponent, MapMarkerComponent, MapInfoWindowComponent],
  declarations: [MapComponent, MapMarkerComponent, MapInfoWindowComponent],
  providers: [
    { provide: "MapService", useClass: MapService },
  ],
  entryComponents: [MapComponent]
})
export class MapModule {
  constructor(@Inject('MapService') private mapService: MapService) {
    this.mapService.loadGoogleMap().subscribe(loaded => {
      if (loaded) {
        console.log(`map module: google maps api loaded ${loaded}`);
      }
    });
  }
}
