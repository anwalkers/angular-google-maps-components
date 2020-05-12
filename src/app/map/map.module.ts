import { NgModule, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./google-map/google-map.component";
import { MapService } from "./services/map.service";
import { MapMarkerComponent } from "./map-marker/map-marker.component";
import { MapInfoWindowComponent } from "./map-info-window/map-info-window.component";
import { MapEventManagerService } from "./services/map-event-manager.service";
import { EsriMapService } from "./services/esri-map.service";
import { EsriMapComponent } from "./esri-map/esri-map.component";
import { EsriFeatureLayerComponent } from "./esri-feature-layer/esri-feature-layer.component";

const components = [
  MapComponent,
  MapMarkerComponent,
  MapInfoWindowComponent,
  EsriMapComponent,
  EsriFeatureLayerComponent
];

@NgModule({
  imports: [CommonModule],
  exports: components,
  declarations: components,
  providers: [
    { provide: "MapService", useClass: MapService },
    { provide: "EsriMapService", useClass: EsriMapService }
  ],
  entryComponents: [MapComponent]
})
export class MapModule {
  constructor(@Inject("MapService") private mapService: MapService) {
    this.mapService.googleMapsLoaded.subscribe(loaded => {
      if (loaded) {
        console.log(`map module: google maps api loaded ${loaded}`);
      }
    });
  }
}
