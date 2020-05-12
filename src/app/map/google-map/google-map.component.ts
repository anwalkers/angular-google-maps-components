import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  NgZone
} from "@angular/core";
import { MapService } from "../services/map.service";
import { MapEventManagerService } from "../services/map-event-manager.service";
import { of, BehaviorSubject } from "rxjs";

export const DEFAULT_OPTIONS: google.maps.MapOptions = {
  center: { lat: 47.674293, lng: -117.095853 },
  zoom: 17
};

export const DEFAULT_HEIGHT: string | number = "300px";
export const DEFAULT_WIDTH: string | number = "100%";

@Component({
  selector: "app-map",
  templateUrl: "./google-map.component.html",
  styleUrls: ["./google-map.component.css"]
})
export class MapComponent implements OnInit {
  @Input() height: string | number = DEFAULT_HEIGHT;

  @Input() width: string | number = DEFAULT_WIDTH;

  @Input() mapTypeId: google.maps.MapTypeId | undefined;

  @Input()
  public set mapOptions(options: google.maps.MapOptions) {
    this._mapOptions.next(options);
  }

  @Input()
  set center(center: google.maps.LatLngLiteral | google.maps.LatLng) {
    this._center.next(center);
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom.next(zoom);
  }

  @Output()
  public mapReady = new EventEmitter<boolean>(false);

  public map?: google.maps.Map;

  private _mapOptions: BehaviorSubject<
    google.maps.MapOptions
  > = new BehaviorSubject<google.maps.MapOptions>(DEFAULT_OPTIONS);
  private _center: BehaviorSubject<
    google.maps.LatLng | google.maps.LatLngLiteral
  > = new BehaviorSubject<google.maps.LatLng | google.maps.LatLngLiteral>(
    DEFAULT_OPTIONS.center
  );
  private _zoom: BehaviorSubject<number> = new BehaviorSubject<number>(
    DEFAULT_OPTIONS.zoom
  );

  private _eventManagerService: MapEventManagerService = new MapEventManagerService(
    this._ngZone
  );

  constructor(
    @Inject("MapService") private _mapService: MapService,
    private _ngZone: NgZone
  ) {
    console.log(
      `map component: map is defined ${this.map !== undefined}`
    );
  }

  ngOnInit() {
    this._mapService.googleMapsLoaded.subscribe(loaded => {
      console.log(`map component: google maps api loaded: ${loaded}`);
      if (loaded) {
        this._mapOptions.subscribe(mapOptions => {
          this._ngZone.runOutsideAngular(() => {
            this.map = new google.maps.Map(
              document.getElementById("map"),
              mapOptions
            );
            console.log(`map component: map created`);
            this.mapReady.emit(true);
          });
        });
      }
    });
  }
}
