import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-esri-feature-layer',
  templateUrl: './esri-feature-layer.component.html',
  styleUrls: ['./esri-feature-layer.component.css']
})
export class EsriFeatureLayerComponent implements OnInit {
  @Input()
  public set features(features: __esri.Graphic[]) {

  }

  constructor() { }

  ngOnInit() {
  }

}