import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from "@angular/core";
import { MapInfoWindowComponent } from './map/map-info-window/map-info-window.component'
import { BehaviorSubject } from "rxjs";
import { MapMarkerComponent } from './map/map-marker/map-marker.component';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild(MapInfoWindowComponent, {static: false}) public infoWindow: MapInfoWindowComponent;

  public markerOptionsCollection: google.maps.MarkerOptions[] = [];

  public mapOptions: google.maps.MapOptions;
  public infoWindowOptions: google.maps.InfoWindowOptions;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.mapOptions = {
      center: { lat: 47.674293, lng: -117.095853 },
      zoom: 14
    };
  }

  public loadData(event) {
    console.log(
      `app component: load marker data: ${event} and ${JSON.stringify(
        this.markerOptionsCollection
      )}`
    );

    this.markerOptionsCollection = [
      ...this.markerOptionsCollection,
      {
        position: {
          lat: 47.674293,
          lng: -117.095853
        },
        title: "A pin",
        clickable: true,
        label: 'A'
      },
      {
        position: {
          lat: 47.665,
          lng: -117.098
        },
        title: "B pin",
        clickable: true,
        label: 'B'
      }
    ];

    this.changeDetectorRef.detectChanges();
  }

  public addMarker() {
    this.markerOptionsCollection = [
      ...this.markerOptionsCollection,
      {
        position: {
          lat: 47.68,
          lng: -117.1
        }
      }
    ];
  }

  public markerClicked(markerComponent: MapMarkerComponent) {
    
    this.infoWindowOptions = {
      content: `<div>this is content! ${markerComponent.getTitle()}</div>`
    }
    this.infoWindow.open(markerComponent);
  }
}
