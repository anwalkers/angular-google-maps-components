import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  Inject,
  OnDestroy,
  NgZone
} from "@angular/core";
import { MapInfoWindowComponent } from "./map/map-info-window/map-info-window.component";
import { BehaviorSubject } from "rxjs";
import { MapMarkerComponent } from "./map/map-marker/map-marker.component";
import { MapService } from "./map/services/map.service";
import { GoogleMapsConfig } from "./map/maps";
import { loadModules } from "esri-loader";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindowComponent, { static: false })
  public infoWindow: MapInfoWindowComponent;

  public markerOptionsCollection: google.maps.MarkerOptions[] = [];

  public mapOptions: google.maps.MapOptions;
  public infoWindowOptions: google.maps.InfoWindowOptions;

  private mapConfig: GoogleMapsConfig = {
    clientId: "",
    key: "",
    libraries: "places"
  };

  public graphics: __esri.Graphic[];

  constructor(
    @Inject("MapService") private _mapService: MapService,
    private changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this._mapService.loadGoogleMap(this.mapConfig);
  }

  ngOnInit() {
    this.mapOptions = {
      center: { lat: 47.674293, lng: -117.095853 },
      zoom: 13
    };
  }

  ngOnDestroy() {}

  public loadData(event) {
    console.log(
      `app component: load marker data: ${event} and ${JSON.stringify(
        this.markerOptionsCollection
      )}`
    );

    this.markerOptionsCollection = [
      ...this.markerOptionsCollection,
      {
        position: {
          lat: 47.674293,
          lng: -117.095853
        },
        title: "A pin",
        clickable: true,
        label: "A"
      },
      {
        position: {
          lat: 47.665,
          lng: -117.098
        },
        title: "B pin",
        clickable: true,
        label: "B"
      }
    ];

    this._ngZone.runOutsideAngular(() => {
      loadModules(["esri/Graphic"]).then(([graphic]) => {
        const simpleMarker = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 10, 10]
        };

        this.graphics = [
          new graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: -117.095853,
              latitude: 47.674293
            },
            symbol: simpleMarker
          }),
          new graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: -117.098,
              latitude: 47.665
            },
            symbol: simpleMarker
          })
        ];
      });
    });

    this.changeDetectorRef.detectChanges();
  }

  public addMarker() {
    this.markerOptionsCollection = [
      ...this.markerOptionsCollection,
      {
        position: {
          lat: 47.68,
          lng: -117.1
        }
      }
    ];

    this._ngZone.runOutsideAngular(() => {
      loadModules(["esri/Graphic"]).then(([graphic]) => {
        const simpleMarker = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 10, 10]
        };

        this.graphics = [
          ...this.graphics,
          new graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: -117.1,
              latitude: 47.68
            },
            symbol: simpleMarker
          })
        ];
      });
    });
  }

  public markerClicked(markerComponent: MapMarkerComponent) {
    this.infoWindowOptions = {
      content: `<div>this is content! ${markerComponent.getTitle()}</div>`
    };
    this.infoWindow.open(markerComponent);
  }
}
