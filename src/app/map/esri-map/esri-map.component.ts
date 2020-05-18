// import esri = __esri;

import { loadModules } from "esri-loader";

import {
  Component,
  OnInit,
  Input,
  Output,
  NgZone,
  EventEmitter
} from "@angular/core";

import { BehaviorSubject, from } from "rxjs";

export const DEFAULT_MAP_PROPERTIES: __esri.MapProperties = {
  basemap: "topo"
};
export const DEFAULT_MAPVIEW_PROPERTIES: __esri.MapViewProperties = {
  center: [-117.095853, 47.674293],
  zoom: 13
};
export const DEFAULT_HEIGHT: string | number = "300px";
export const DEFAULT_WIDTH: string | number = "100%";

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.css"]
})
export class EsriMapComponent implements OnInit {
  @Input() height: string | number = DEFAULT_HEIGHT;

  @Input() width: string | number = DEFAULT_WIDTH;

  @Input()
  public set viewType(viewType: string) {
    this._viewType.next(viewType);
  }

  @Input()
  public set mapProperties(options: __esri.MapProperties) {
    this._mapProperties.next(options);
  }

  @Input()
  public set mapViewProperties(options: __esri.MapViewProperties) {
    this._mapViewProperties.next(options);
  }

  @Input()
  set center(center: number[] | __esri.PointProperties) {
    this._center.next(center);
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom.next(zoom);
  }

  @Output()
  public mapReady = new EventEmitter<boolean>(false);

  private _viewType: BehaviorSubject<string> = new BehaviorSubject<string>(
    "MapView"
  );
  private _mapProperties: BehaviorSubject<
    __esri.MapProperties
  > = new BehaviorSubject<__esri.MapProperties>(DEFAULT_MAP_PROPERTIES);
  private _mapViewProperties: BehaviorSubject<
    __esri.MapViewProperties
  > = new BehaviorSubject<__esri.MapViewProperties>(DEFAULT_MAPVIEW_PROPERTIES);

  private _center: BehaviorSubject<
    number[] | __esri.PointProperties
  > = new BehaviorSubject<number[] | __esri.PointProperties>(
    DEFAULT_MAPVIEW_PROPERTIES.center
  );
  private _zoom: BehaviorSubject<number> = new BehaviorSubject<number>(
    DEFAULT_MAPVIEW_PROPERTIES.zoom
  );

  public map?: __esri.Map;
  public view?: __esri.View | __esri.MapView | __esri.SceneView;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    from(
      loadModules(["esri/Map", `esri/views/${this._viewType.value}`]).then(
        response => {
          let mapCtor: __esri.MapConstructor = response[0];
          let mapView: __esri.ViewConstructor = response[1];

          // create map
          const map = new mapCtor(this._mapProperties.value);

          console.log(
            "ESRI: HTMLDivElement: " + document.getElementById("esri-map")
          );
          const viewProps: __esri.MapViewProperties = {
            container: "esri-map",
            map: map
          };
          // prepare properties that should be set locally
          // create a new object so as to not modify the provided object
          const newViewProps: __esri.ViewProperties = {
            ...this._mapViewProperties.value,
            ...viewProps
          };

          // create the MapView
          const view = new mapView(newViewProps);

          this.map = map;
          this.view = view;

          return map;
        }
      )
    ).subscribe(() => {
      this.mapReady.emit(true);
    });
  }
}
