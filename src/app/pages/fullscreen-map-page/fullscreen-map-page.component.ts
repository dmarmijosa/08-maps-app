import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = environment.mapBoxKey;
@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div{
      width:100vw;
      height: calc(100vh - 64px);
    }

  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElemnt = viewChild<ElementRef>('map');

  async ngAfterViewInit() {
    await new Promise((resolve) => setTimeout( resolve, 80));
    if (!this.divElemnt()?.nativeElement) return;
    const element = this.divElemnt()?.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }
}
