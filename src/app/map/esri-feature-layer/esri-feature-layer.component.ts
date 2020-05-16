import { Component, OnInit, Input, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { EsriMapComponent } from "../esri-map/esri-map.component";

@Component({
  selector: "app-esri-feature-layer",
  templateUrl: "./esri-feature-layer.component.html",
  styleUrls: ["./esri-feature-layer.component.css"]
})
export class EsriFeatureLayerComponent implements OnInit {
  @Input()
  public set graphics(graphics: __esri.Graphic[]) {
    this._graphics.next(graphics);
  }

  private _graphics: BehaviorSubject<
    __esri.Graphic[] | undefined
  > = new BehaviorSubject<__esri.Graphic[] | undefined>(undefined);

  constructor(
    private _esriMapComponent: EsriMapComponent,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this._graphics.subscribe(graphics => {
      if (graphics !== undefined) {
        this._ngZone.runOutsideAngular(() => {
          graphics.map(graphic => {
            this._esriMapComponent.view.graphics.add(graphic);
          });
        });
      }
    });
  }
}
