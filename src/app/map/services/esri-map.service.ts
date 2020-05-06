import { Injectable, ElementRef, EventEmitter, NgZone } from "@angular/core";
import esri = __esri;
import { Observable } from "rxjs";
import { loadModules, ILoadScriptOptions } from "esri-loader";

@Injectable()
export class EsriMapService {
  isLoaded = new EventEmitter();
  map: esri.Map;
  view: esri.View;

  constructor(private ngZone: NgZone) {}

  public prepareViewProps(
    mapViewProperties: esri.ViewProperties,
    mapEl: ElementRef,
    map: esri.Map
  ) {
    const newViewProps = this.extend({}, mapViewProperties);

    if (!newViewProps.container) {
      newViewProps.container = mapEl.nativeElement.id;
    }
    if (!newViewProps.map) {
      newViewProps.map = map;
    }

    return newViewProps;
  }

  public loadMap(
    mapProperties: esri.MapProperties,
    viewProperties: esri.ViewProperties,
    mapEl: ElementRef,
    viewType: string = "MapView"
  ): Observable<{ map: esri.Map; view: esri.View }> {
    const observable = new Observable<{ map: esri.Map; view: esri.View }>(
      subscriber => {
        this.ngZone.runOutsideAngular(() => {
          loadModules(["esri/Map", "esri/views/" + viewType, "domReady!"]).then(
            response => {
              let mapCtor: esri.MapConstructor = response[0];
              let mapView: esri.ViewConstructor = response[1];

              // create map
              const map = new mapCtor(mapProperties);

              // prepare properties that should be set locally
              // create a new object so as to not modify the provided object
              const newViewProps = this.prepareViewProps(
                viewProperties,
                mapEl,
                map
              );

              // create the MapView
              const view = new mapView(newViewProps);

              this.map = map;
              this.view = view;
              subscriber.next({ map, view });
            }
          );
        });
      }
    );
    return observable;
  }

  public loadWebMap(
    webMapProperties: esri.WebMapProperties,
    viewProperties: esri.ViewProperties,
    mapEl: ElementRef,
    viewType: string = "MapView"
  ) {
    let response = loadModules([
      "esri/WebMap",
      "esri/views/" + viewType,
      "domReady!"
    ]);
    let webMap: esri.WebMapConstructor = response[0];
    let mapView: esri.MapViewConstructor = response[1];

    // create map
    const map = new webMap(webMapProperties);

    // prepare properties that should be set locally
    // create a new object so as to not modify the provided object
    const newViewProps = this.prepareViewProps(viewProperties, mapEl, map);

    // create the MapView
    const view = new mapView(newViewProps);

    this.map = map;
    this.view = view;

    this.isLoaded.emit();

    return {
      map,
      view
    };
  }

  public addFeatureLayer(url: string) {
    let response = loadModules([
      "esri/layers/FeatureLayer",
      "domReady!"
    ]);
    let featureLayer: esri.FeatureLayerConstructor = response[0];

    let featureLayerProps: esri.FeatureLayerProperties = {
      url
    };
    let layer = new featureLayer(featureLayerProps);

    this.map.add(layer);
  }

  public addWidget(element: HTMLElement, position: string) {
    this.view.ui.add(element, position);
  }

  private extend(obj: esri.ViewProperties, src: esri.ViewProperties) {
    Object.keys(src).forEach(key => {
      obj[key] = src[key];
    });
    return obj;
  }
}
