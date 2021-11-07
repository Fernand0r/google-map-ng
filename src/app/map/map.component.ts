import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { GeometryObject } from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  mapInitCfg = {};
  private markers: google.maps.Marker[] = [];
  private polygon: google.maps.Polygon | null = null;
  private maps: Maps = null;
  private mapInstance: google.maps.Map | null = null;
  readonly COORD_OF_CHENGDU = { lat: 30.6587488, lng: 103.9354613 };
  constructor(private messageService: CommunicationService) {
    this.messageService.renderCoords$.subscribe((coords: Marker[]) => {
      this.renderMarkers(coords);
    });
    this.messageService.centerCoord$.subscribe((coord: Coordinate) => {
      this.setCenter(coord);
    });
    this.messageService.clearMapMarkers$.subscribe(() => {
      this.clearMarkers();
    });
    this.messageService.renderShpFile$.subscribe((geoJson: GeometryObject) => {
      this.loadShapeFile(geoJson);
    });
  }

  ngOnInit(): void {
    this.mapInitCfg = {
      center: this.COORD_OF_CHENGDU,
      zoom: 9,
    };
  }

  loadShapeFile(geoJson: GeometryObject) {
    this.mapInstance?.data.addGeoJson({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: geoJson }],
    });
    this.mapInstance?.data.setStyle({
      strokeColor: 'blue',
    });
    const [lng, lat, ...rest] =
      'coordinates' in geoJson && geoJson.coordinates instanceof Array
        ? (geoJson.coordinates.flat(Infinity) as number[])
        : [];
    if (lng && lat) this.setCenter({ lat, lng });
    this.mapInstance?.setZoom(12);
  }

  clearMarkers() {
    this.markers.forEach((item: google.maps.Marker) => {
      item.setMap(null);
    });
    this.markers.length = 0;
  }

  initCompleted({
    mapIns,
    maps,
  }: {
    mapIns: google.maps.Map;
    maps: Maps;
  }): void {
    this.maps = maps;
    this.mapInstance = mapIns;

    this.mapInstance?.addListener('rightclick', () => {
      if (!this.markers.length) return;
      this.initPolygons();
      this.messageService.clearCoords();
      this.initColorPicker();
    });
  }

  initPolygons() {
    this.polygon = new this.maps!.Polygon({
      paths: this.markers.map((marker) => marker.getPosition()?.toJSON()),
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    this.polygon!.setMap(this.mapInstance);
  }

  initColorPicker() {
    const $btn = document.createElement('div');
    $btn.innerText = 'polygon color picker';
    Object.assign($btn.style, {
      width: '120px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      index: 1,
      borderRadius: '2px',
      backgroundColor: '#fff',
      margin: '10px',
      cursor: 'pointer',
    });
    google.maps.event.addDomListener($btn, 'click', () => {
      const currentColor = `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
      this.polygon?.setOptions({
        strokeColor: currentColor,
        fillColor: currentColor,
      });
    });
    if (
      !this.mapInstance?.controls[
        this.maps!.ControlPosition.TOP_CENTER
      ].getLength()
    )
      this.mapInstance?.controls[this.maps!.ControlPosition.TOP_CENTER].push(
        $btn
      );
  }

  setCenter(coord: Coordinate) {
    this.mapInstance?.setCenter(coord);
  }

  renderMarkers(coords: Marker[]): void {
    for (let index = 0; index < coords.length; index++) {
      const { coordinate: position } = coords[index];
      this.markers.push(
        new this.maps!.Marker({
          position,
          map: this.mapInstance,
          title: String(index + 1),
        })
      );
    }
  }
}
