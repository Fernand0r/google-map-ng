import { Component } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { openShp, Source } from 'shapefile';
import { GeometryObject } from 'geojson';
import { CommunicationService } from '../communication.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-coords',
  templateUrl: './coords.component.html',
  styleUrls: ['./coords.component.scss'],
})
export class CoordsComponent {
  private cache: string[] = [];
  debounceGenerateCoords = new Subject()
  currentId: number = -1
  coords = [];
  markers: Marker[] = [];
  constructor(private messageServive: CommunicationService) {
    this.debounceGenerateCoords.pipe(debounceTime(300)).subscribe(() => {
      this.generateCoords()
    })
    this.messageServive.clearListCoords$.subscribe(() => {
      this.markers = []
    })
  }

  handleChange(info: NzUploadChangeParam): void {
    const { file } = info;
    if (!file.originFileObj) return;
    file.originFileObj
      .arrayBuffer()
      .then(openShp)
      .then((source: Source<GeometryObject>) =>
        source.read().then((result) => {
          if (result.done) return;
          this.messageServive.renderShpFile(result.value)
        })
      );
  }

  generateCoords() {
    let id = this.markers.length;
    this.markers.push(
      ...Array.from({ length: 5000 }).map(() => {
        id++;
        let lat: string, lng: string;
        do {
          lat = (Math.random() * (85 - -85 + 1) + -85).toFixed(6);
          lng = (Math.random() * (180 - -180 + 1) + -180).toFixed(6);
        } while (this.cache.includes(lat + lng));
        this.cache.push(lat + lng);
        return {
          coordinate: {
            lat: Number(lat),
            lng: Number(lng),
          },
          id,
        };
      })
    );
    this.cache.length = 0;
    this.messageServive.renderCoords(this.markers);
  }

  setCenter(markerId: number) {
    const matchMarker = this.markers.find(
      (marker: Marker) => markerId === marker.id
    );
    if (matchMarker) {
      this.messageServive.centerCoord(matchMarker.coordinate);
      this.currentId = markerId
    }
  }
}
