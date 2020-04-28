import {
  Directive,
  OnInit,
  Input,
  Inject,
  NgZone,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Observable, BehaviorSubject, Subject, combineLatest } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";
import { MapService } from "../services/map.service";
import { MapMarkerComponent } from "../map-marker/map-marker.component";
import { MapEventManagerService } from "../services/map-event-manager.service";
import { MapComponent } from "../map-component/map.component";

@Directive({
  selector: "app-map-info-window",
  host: { style: "display: none" }
})
export class MapInfoWindowComponent implements OnInit, OnDestroy {
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
  private readonly _destroy = new Subject<void>();

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
    @Inject("MapService") private _mapService: MapService,
    private _mapComponent: MapComponent
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

  ngOnDestroy() {
    this._eventManagerService.destroy();
    this._destroy.next();
    this._destroy.complete();

    // If no info window has been created on the server, we do not try closing it.
    // On the server, an info window cannot be created and this would cause errors.
    if (this.infoWindow) {
      this.close();
    }
  }

  public open(anchor?: MapMarkerComponent) {
    const marker = anchor ? anchor.marker : undefined;
    this._elementRef.nativeElement.style.display = "";
    if (this.infoWindow) {
      this.infoWindow!.open(this._mapComponent.map, marker);
    } else {
      console.log("info window undefined");
    }
  }

  public close() {
    this.infoWindow!.close();
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
    this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
      this.infoWindow.setOptions(options);
    });
  }
}
