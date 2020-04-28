import { Injectable, NgZone } from "@angular/core";
import { WindowRef, DocumentRef } from "../../utilities/browser-global";
import { BehaviorSubject, Observable, of, fromEvent } from "rxjs";

@Injectable()
export class MapService {

  constructor(
    private _zone: NgZone,
    private _windowRef: WindowRef,
    private _documentRef: DocumentRef
  ) {
    // this.loadGoogleMap().subscribe(() => {
    //   this.googleMapsLoaded.next(true);
    // })
  }

  public loadGoogleMap(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      if (
        this._windowRef.getNativeWindow().google &&
        this._windowRef.getNativeWindow().google.maps
      ) {
        console.log("google maps api already loaded")
        return subscriber.next(true);
      }

      const script = this._documentRef
        .getNativeDocument()
        .createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.id = "google-map-script";
      script.src =
        "https://maps.googleapis.com/maps/api/js?libraries=places&callback=googleMapLoaded";

      (this._windowRef.getNativeWindow() as any)["googleMapLoaded"] = () => {
        console.log("google maps api finished loading")
        return subscriber.next(true);
      };

      this._documentRef.getNativeDocument().body.appendChild(script);
    });
  }
}
