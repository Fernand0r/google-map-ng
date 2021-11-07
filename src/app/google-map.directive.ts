import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Directive({
  selector: '[appGoogleMap]',
})
export class GoogleMapDirective {
  @Input() appGoogleMap = {};
  @Output() mapLoaded = new EventEmitter<{
    mapIns: google.maps.Map;
    maps: Maps;
  }>();
  constructor(el: ElementRef) {
    this.initMap(el.nativeElement);
  }

  async initMap(el: HTMLElement): Promise<void> {
    const loader = new Loader({
      apiKey: '',
      version: 'test',
    });
    const { maps } = await loader.load();
    this.mapLoaded.emit({ mapIns: new maps.Map(el, this.appGoogleMap), maps });
  }
}
