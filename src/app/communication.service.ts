import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeometryObject } from 'geojson';

@Injectable()
export class CommunicationService {
  private generateCoordsSource = new Subject<Marker[]>();
  private renderCoordsSource = new Subject<Marker[]>();
  private clearMapMarkersSource = new Subject();
  private clearListCoordsSource = new Subject();
  private centerCoordSource = new Subject<Coordinate>()
  private renderShpFileSource = new Subject<GeometryObject>()

  generateCoords$ = this.generateCoordsSource.asObservable();
  renderCoords$ = this.renderCoordsSource.asObservable();
  clearMapMarkers$ = this.clearMapMarkersSource.asObservable();
  clearListCoords$ = this.clearListCoordsSource.asObservable();
  centerCoord$ = this.centerCoordSource.asObservable();
  renderShpFile$ = this.renderShpFileSource.asObservable();

  generateCoords(coords: Marker[]): void {
    this.generateCoordsSource.next(coords);
  }

  renderCoords(coords: Marker[]): void {
    this.renderCoordsSource.next(coords);
  }

  clearCoords(): void {
    this.clearMapMarkersSource.next();
    this.clearListCoordsSource.next();
  }

  centerCoord(coord: Coordinate): void {
    this.centerCoordSource.next(coord);
  }

  renderShpFile(data: GeometryObject): void {
    this.renderShpFileSource.next(data)
  }
}
