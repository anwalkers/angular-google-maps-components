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

}
