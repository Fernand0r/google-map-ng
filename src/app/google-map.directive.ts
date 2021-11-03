import { Directive, ElementRef, Input } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader"

@Directive({
  selector: '[appGoogleMap]'
})
export class GoogleMapDirective {
  @Input() appGoogleMap = {}
  public mapInstance = null
  constructor(el: ElementRef) {
    this.initMap(el.nativeElement)
  }

  async initMap(el: HTMLElement):Promise<void> {
    const loader = new Loader({
      apiKey: "",
      version: "weekly",
    });
    const { maps } = await loader.load()
    this.mapInstance = new maps.Map(el, this.appGoogleMap);
  }
}
