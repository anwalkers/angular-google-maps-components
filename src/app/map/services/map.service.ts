import { Injectable, NgZone } from "@angular/core";
import { WindowRef, DocumentRef } from "../../utilities/browser-global";
import { BehaviorSubject, Observable, of, fromEvent } from "rxjs";
import { GoogleMapsConfig } from "../maps";

@Injectable()
export class MapService {
  private set mapConfig(mapConfig: GoogleMapsConfig) {
    this._mapConfig = mapConfig ? mapConfig : {};
  }

  private get key(): string {
    let keyStr: string;
    if (this._mapConfig.clientId) {
      keyStr = `&client=${this._mapConfig.clientId}`;
      console.log("Using ClientId");
    } else {
      keyStr = this._mapConfig.key ? `&key=${this._mapConfig.key}` : '';
    }
    return keyStr;
  }

  private get libraries(): string {
    return this._mapConfig.libraries
      ? `&libraries=${this._mapConfig.libraries}`
      : "";
  }

  public googleMapsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  private _mapConfig: GoogleMapsConfig;

  constructor(
    private _zone: NgZone,
    private _windowRef: WindowRef,
    private _documentRef: DocumentRef
  ) {}

  public loadGoogleMap(mapConfig?: GoogleMapsConfig) {
    this.mapConfig = mapConfig;

    if (
      this._windowRef.getNativeWindow().google &&
      this._windowRef.getNativeWindow().google.maps
    ) {
      console.log("google maps api already loaded");
      this.googleMapsLoaded.next(true);
    }

    const script = this._documentRef
      .getNativeDocument()
      .createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.id = "google-map-script";
    script.src = `https://maps.googleapis.com/maps/api/js?callback=googleMapLoaded${this.key}${this.libraries}`;

    (this._windowRef.getNativeWindow() as any)["googleMapLoaded"] = () => {
      console.log("google maps api finished loading");
      this.googleMapsLoaded.next(true);
    };

    this._documentRef.getNativeDocument().body.appendChild(script);
  }
}
