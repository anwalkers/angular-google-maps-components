import {
  Directive,
  OnInit,
  Input,
  Inject,
  NgZone,
  ElementRef
} from "@angular/core";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";
import { MapService } from "../services/map.service";
import { MapMarkerComponent } from "../map-marker/map-marker.component";
import { MapEventManagerService } from "../services/map-event-manager.service";

@Directive({
  selector: "app-map-info-window",
  host: { style: "display: none" }
})
export class MapInfoWindowComponent implements OnInit {
  @Input()
  set options(options: google.maps.InfoWindowOptions) {
    this._options.next(options || {});
  }

  @Input()
  set position(position: google.maps.LatLngLiteral | google.maps.LatLng) {
    this._position.next(position);
  }

  private _eventManagerService: MapEventManagerService = new MapEventManagerService(
    this._ngZone
  );

  private readonly _options = new BehaviorSubject<
    google.maps.InfoWindowOptions
  >({});
  private readonly _position = new BehaviorSubject<
    google.maps.LatLngLiteral | google.maps.LatLng | undefined
  >(undefined);

  public infoWindow: google.maps.InfoWindow;

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef,
    @Inject("MapService") private _mapService: MapService
  ) {}

  public ngOnInit() {
    this._mapService.googleMapsLoaded.subscribe(loaded => {
      if (loaded) {
        console.log(`map info window created`);
        const combineOptions$ = this._combineOptions();

        combineOptions$.pipe(take(1)).subscribe(options => {
          this._ngZone.runOutsideAngular(() => {
            this.infoWindow = new google.maps.InfoWindow(options);
          });
          this._eventManagerService.setEventListenerTarget(this.infoWindow);
        });

        this._watchForOptionsChanges();
      }
    });
  }

  public open(anchor?: MapMarkerComponent) {
    const marker = anchor ? anchor.marker : undefined;
    this._elementRef.nativeElement.style.display = "";
    if (this.infoWindow) {
      this.infoWindow!.open(this._mapService.map, marker);
    } else {
      console.log("info window undefined");
    }
  }

  private _combineOptions(): Observable<google.maps.InfoWindowOptions> {
    return combineLatest([this._options, this._position]).pipe(
      map(([options, position]) => {
        const combinedOptions: google.maps.InfoWindowOptions = {
          ...options,
          position: position || options.position,
          content: this._elementRef.nativeElement
        };
        return combinedOptions;
      })
    );
  }

  private _watchForOptionsChanges() {
    this._options.subscribe(options => {
      console.log(`options content: ${options.content}`);

      this.infoWindow.setOptions(options);
    });
  }

  private _destroy() {}
}
