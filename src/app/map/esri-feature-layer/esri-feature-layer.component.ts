import { Component, OnInit, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-esri-feature-layer",
  templateUrl: "./esri-feature-layer.component.html",
  styleUrls: ["./esri-feature-layer.component.css"]
})
export class EsriFeatureLayerComponent implements OnInit {
  @Input()
  public set points(points: __esri.Point[]) {
    this._points.next(points);
  }

  private _points: BehaviorSubject<
    __esri.Point[] | undefined
  > = new BehaviorSubject<__esri.Point | undefined>(undefined);

  constructor() {}

  ngOnInit() {}
}
