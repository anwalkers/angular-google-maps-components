import {
  Component,
  OnInit,
  Input,
  Inject,
  NgZone,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from "@angular/core";
import { MapComponent } from "../google-map/google-map.component";
import { Observable, of, combineLatest, BehaviorSubject } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";
import { MapEventManagerService } from "../services/map-event-manager.service";

export const DEFAULT_MARKER_OPTIONS = {
  position: { lat: 37.421995, lng: -122.084092 }
};

@Component({
  selector: "app-map-marker",
  templateUrl: "./map-marker.component.html",
  styleUrls: ["./map-marker.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MapMarkerComponent implements OnInit {
  @Input()
  public set markerOptions(options: google.maps.MarkerOptions) {
    this._options.next(options || DEFAULT_MARKER_OPTIONS);
  }

  @Input()
  public set title(title: string) {
    this._title.next(title);
  }

  @Input()
  set label(label: string | google.maps.MarkerLabel) {
    this._label.next(label);
  }

  @Input()
  public set position(
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ) {
    this._position.next(position);
  }

  @Input()
  public set clickable(clickable: boolean) {
    this._clickable.next(clickable);
  }

  @Output()
  public get markerClick(): Observable<google.maps.MouseEvent> {
    return this._eventManagerService.getTargetEvent<google.maps.MouseEvent>(
      "click"
    );
  }

  private _options: BehaviorSubject<
    google.maps.MarkerOptions
  > = new BehaviorSubject(DEFAULT_MARKER_OPTIONS);

  private _clickable: BehaviorSubject<
    boolean | undefined
  > = new BehaviorSubject<boolean | undefined>(undefined);
  private _label: BehaviorSubject<
    string | google.maps.MarkerLabel | undefined
  > = new BehaviorSubject<string | google.maps.MarkerLabel | undefined>(
    undefined
  );
  private _position: BehaviorSubject<
    google.maps.LatLng | google.maps.LatLngLiteral | undefined
  > = new BehaviorSubject<
    google.maps.LatLng | google.maps.LatLngLiteral | undefined
  >(undefined);
  private _title: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(
    undefined
  );

  public marker?: google.maps.Marker;

  private _eventManagerService: MapEventManagerService = new MapEventManagerService(
    this._ngZone
  );

  constructor(
    private readonly _mapComponent: MapComponent,
    private _ngZone: NgZone
  ) {
    console.log(
      `map marker: map is defined ${this._mapComponent.map !== null}`
    );
  }

  public ngOnInit() {
    this._options.subscribe(options => {
      this.combineOptions().subscribe(options => {
        this._ngZone.runOutsideAngular(() => {
          console.log(`map marker: adding marker: ${options}`);

          this.marker = new google.maps.Marker(options);
          this._eventManagerService.setEventListenerTarget(this.marker);
        });
      });
    });
  }

  public getTitle(): string | null {
    return this.marker!.getTitle() || null;
  }

  private combineOptions(): Observable<google.maps.MarkerOptions> {
    return combineLatest([
      this._options,
      this._title,
      this._position,
      this._label,
      this._clickable
    ]).pipe(
      map(([options, title, position, label, clickable]) => {
        const combinedOptions: google.maps.MarkerOptions = {
          ...options,
          title: title || options.title,
          position: position || options.position,
          label: label || options.label,
          clickable: clickable !== undefined ? clickable : options.clickable,
          map: this._mapComponent.map
        };
        return combinedOptions;
      })
    );
  }
}
