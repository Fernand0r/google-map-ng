import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  mapInitCfg = {};
  constructor() {}

  ngOnInit(): void {
    this.mapInitCfg = {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    };
  }
}
