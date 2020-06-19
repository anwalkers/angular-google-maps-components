import {
  Component,
  OnInit,
  Input,
  Output,
  NgZone,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  EventEmitter
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { EsriMapComponent } from "../esri-map/esri-map.component";

@Component({
  selector: "app-esri-graphic",
  template: "<ng-content></ng-content>",
  styleUrls: ["./esri-graphic.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EsriGraphicComponent implements OnInit {
  @Input()
  public set graphic(graphic: __esri.Graphic) {
    this._graphic.next(graphic);
  }

  private _graphic: BehaviorSubject<
    __esri.Graphic | undefined
  > = new BehaviorSubject<__esri.Graphic | undefined>(undefined);

  constructor(
    private _esriMapComponent: EsriMapComponent,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this._graphic.subscribe(graphic => {
      if (graphic !== undefined) {
        this._ngZone.runOutsideAngular(() => {
          this._esriMapComponent.view.graphics.add(graphic);
        });
      }
    });
  }
}
