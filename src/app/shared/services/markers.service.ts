import { Injectable } from '@angular/core';
import { Marker } from '../../pages/markers-page/markers-page.component';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  private markersCache = new Map<string, Marker[]>();

  getMarkerscache(): Marker[]{
    if(!this.markersCache.get('markers')?.length){
      return []
    }

    return this.markersCache.get('markers')!;

  }

  setMarketCache(markers: Marker[]){
    if(markers.length===0) return;
    this.markersCache.set('markers', markers);
  }

}
