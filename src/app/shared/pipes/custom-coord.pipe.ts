import { computed, Pipe, signal, type PipeTransform } from '@angular/core';

interface Coordenada{
  lng: number;
  lat:number;
}

@Pipe({
  name: 'coord',
})
export class CustomCoordPipe implements PipeTransform {

  transform(ubicacion: string, ...args: unknown[]): unknown {
    try {
      const { lat, lng } = JSON.parse(ubicacion) as Coordenada;
      return `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
    } catch (error) {
      return 'Coordenadas inválidas';
    }
  }

}
