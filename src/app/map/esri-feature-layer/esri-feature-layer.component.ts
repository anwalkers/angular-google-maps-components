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
  selector: "app-esri-feature-layer",
  templateUrl: "./esri-feature-layer.component.html",
  styleUrls: ["./esri-feature-layer.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EsriFeatureLayerComponent implements OnInit {
  @Input()
  public set popupOptions(options: __esri.PopupOpenOptions) {
    this._popupOptions.next(options);
  }
  @Output()
  public featureLayerClicked: EventEmitter<any> = new EventEmitter<any>();

  private _popupOptions: BehaviorSubject<
    __esri.PopupOpenOptions | undefined
  > = new BehaviorSubject<__esri.PopupOpenOptions | undefined>(undefined);

  constructor(
    private _esriMapComponent: EsriMapComponent,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this._esriMapComponent.mapReady.subscribe(ready => {
      this._esriMapComponent.view.on("click", event => {
        this._esriMapComponent.view.popup.open({
          ...this._esriMapComponent,
        });

        this.featureLayerClicked.emit(event);
      });

      // this._graphics.subscribe(graphics => {
      //   if (graphics !== undefined) {
      //     this._ngZone.runOutsideAngular(() => {
      //       graphics.map(graphic => {
      //         this._esriMapComponent.view.graphics.add(graphic);
      //       });
      //     });
      //   }
      // });
    });
  }
}
