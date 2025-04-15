import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@environments/environment';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { v4 as uuid } from 'uuid';
import { MarkersService } from '../../shared/services/markers.service';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { CustomCoordPipe } from '../../shared/pipes/custom-coord.pipe';
mapboxgl.accessToken = environment.mapBoxKey;

export interface Marker {
  id: string;
  mapBoxMarker: mapboxgl.Marker;
}
@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe, CustomCoordPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent {
  private markerService = inject(MarkersService);
  divElemnt = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (!this.divElemnt()?.nativeElement) return;
    const element = this.divElemnt()?.nativeElement;
    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.07206, 41.3155],
      zoom: 14,
    });

    if (this.markers.length > 0) {
      console.log(this.markers);
    }

    // const marker = new mapboxgl.Marker({
    //   draggable: false,
    //   color: 'black'
    // })
    //   .setLngLat([2.07206, 41.3155])
    //   .addTo(map);

    // marker.on('dragend', (event)=>console.log(event))

    this.mapListerner(map);
    this.mapRestoreMarkers(map);
  }

  mapListerner(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const coords = event.lngLat;
    const mapBoxMarker = new mapboxgl.Marker({
      color: color,
    })
      .setLngLat(coords)
      .addTo(this.map()!);

    const newMarker: Marker = {
      id: uuid(),
      mapBoxMarker: mapBoxMarker,
    };

    this.markers.update((prev) => [...prev, newMarker]);
    this.markerService.setMarketCache(this.markers());
  }

  mapRestoreMarkers(map: mapboxgl.Map) {
    const saved = this.markerService.getMarkerscache();
    const restoredMarkers = saved.map((data) => {
      const mapBoxMarker = new mapboxgl.Marker({
        color: data.mapBoxMarker._color,
      })
        .setLngLat(data.mapBoxMarker._lngLat)
        .addTo(map);
      return { id: data.id, mapBoxMarker };
    });

    this.markers.set(restoredMarkers);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }
}
