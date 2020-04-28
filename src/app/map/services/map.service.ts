import { Injectable, NgZone } from "@angular/core";
import { WindowRef, DocumentRef } from "../../utilities/browser-global";
import { BehaviorSubject, Observable, of, fromEvent } from "rxjs";

@Injectable()
export class MapService {
  public set key(key: string) {
    this._key = key;
  }

  public get key(): string {
    if (this._key) {
      return `&key=${this._key}`;
    } else {
      return "";
    }
  }

  public googleMapsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  private _key: string;

  constructor(
    private _zone: NgZone,
    private _windowRef: WindowRef,
    private _documentRef: DocumentRef
  ) {
    this.loadGoogleMap();
  }

  public loadGoogleMap() {
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
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places${this.key}&callback=googleMapLoaded`;

    (this._windowRef.getNativeWindow() as any)["googleMapLoaded"] = () => {
      console.log("google maps api finished loading");
      this.googleMapsLoaded.next(true);
    };

    this._documentRef.getNativeDocument().body.appendChild(script);
  }
}
