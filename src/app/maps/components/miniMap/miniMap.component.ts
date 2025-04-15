import { Component, ElementRef, input, viewChild } from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxKey;
@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './miniMap.component.html',
  styles: `
    div{
      width:100%;
      height:160px;
    }
  `,
})
export class MiniMapComponent {
  divElement = viewChild<ElementRef>('map');

  lngLat = input.required<{ lng: number; lat: number }>();
  zoom = input<number>(12);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat(), // starting position [lng, lat]
      zoom: this.zoom(),
      interactive: false,
    });

    new mapboxgl.Marker().setLngLat(this.lngLat()).addTo(map);
  }
}
