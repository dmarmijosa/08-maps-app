import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = environment.mapBoxKey;
@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div{
      width:100vw;
      height: calc(100vh - 64px);
    }
    #controls{
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: absolute;
      bottom: 25px;
      right: 20px;
      z-index: 100;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;

    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElemnt = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);

  zoomEfect = effect((onCleanup) => {
    if (!this.map) return;
    this.map()?.setZoom(this.zoom());

    onCleanup(() => {});
  });
  ngAfterViewInit() {
    if (!this.divElemnt()?.nativeElement) return;
    const element = this.divElemnt()?.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });
    this.mapListener(map);
  }

  mapListener(map: mapboxgl.Map) {
    map.on('zoom', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    this.map.set(map);
  }
}
