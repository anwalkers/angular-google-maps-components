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
