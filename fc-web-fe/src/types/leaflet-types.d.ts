// Declaração de tipos para Leaflet e react-leaflet-draw
declare module 'react-leaflet-draw' {
  import * as React from 'react';
  
  export interface EditControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    onEdited?: (e: any) => void;
    onCreated?: (e: any) => void;
    onDeleted?: (e: any) => void;
    onMounted?: (drawControl: any) => void;
    onEditStart?: (e: any) => void;
    onEditStop?: (e: any) => void;
    onDeleteStart?: (e: any) => void;
    onDeleteStop?: (e: any) => void;
    draw?: {
      polyline?: boolean | any;
      polygon?: boolean | any;
      rectangle?: boolean | any;
      circle?: boolean | any;
      marker?: boolean | any;
      circlemarker?: boolean | any;
      [key: string]: boolean | any;
    };
    edit?: {
      edit?: boolean;
      remove?: boolean;
      [key: string]: boolean | any;
    };
  }

  export class EditControl extends React.Component<EditControlProps> {}
}

// Extensões para garantir que o TypeScript reconheça os módulos corretamente
declare module 'leaflet' {
  interface LeafletEvent {
    type: string;
    target: any;
  }

  interface DrawEvents {
    CREATED: string;
    EDITED: string;
    DELETED: string;
    DRAWSTART: string;
    DRAWSTOP: string;
    DRAWVERTEX: string;
    EDITSTART: string;
    EDITMOVE: string;
    EDITRESIZE: string;
    EDITVERTEX: string;
    EDITSTOP: string;
    DELETESTART: string;
    DELETESTOP: string;
  }

  interface Draw {
    Event: DrawEvents;
  }

  // Adicionando suporte ao objeto L
  export const Draw: Draw;

  // Interface para o Icon
  export namespace Icon {
    interface IconOptions {
      iconUrl: string;
      iconRetinaUrl?: string;
      iconSize?: [number, number];
      iconAnchor?: [number, number];
      popupAnchor?: [number, number];
      shadowUrl?: string;
      shadowRetinaUrl?: string;
      shadowSize?: [number, number];
      shadowAnchor?: [number, number];
      className?: string;
    }

    class Default {
      static mergeOptions(options: IconOptions): void;
    }
  }

  // Adicionando suporte ao Control.Draw
  export namespace Control {
    interface DrawConstructorOptions {
      position?: string;
      draw?: {
        polyline?: boolean | any;
        polygon?: boolean | any;
        rectangle?: boolean | any;
        circle?: boolean | any;
        marker?: boolean | any;
        circlemarker?: boolean | any;
        [key: string]: boolean | any;
      };
      edit?: {
        featureGroup: any;
        poly?: {
          allowIntersection?: boolean;
        };
        remove?: boolean;
      };
    }

    class Draw {
      constructor(options: DrawConstructorOptions);
    }
  }

  export interface MapOptions {
    center?: [number, number];
    zoom?: number;
    [key: string]: any;
  }

  export class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setView(center: [number, number], zoom: number): this;
    on(eventName: string, callback: (event: any) => void): this;
    addLayer(layer: any): this;
    addControl(control: any): this;
    remove(): void;
  }

  export class TileLayer {
    constructor(urlTemplate: string, options?: any);
    addTo(map: Map): this;
  }

  export class FeatureGroup {
    constructor();
    addLayer(layer: any): this;
    addTo(map: Map): this;
    eachLayer(callback: (layer: any) => void): this;
  }

  // Adicionando suporte ao polygon
  export function polygon(latlngs: any[], options?: any): Polygon;

  export class Polygon {
    constructor(latlngs: any[], options?: any);
    getBounds(): any;
    addTo(map: any): this;
    toGeoJSON(): any;
  }
}

// Declaração para os componentes que estamos usando do react-leaflet
declare module 'react-leaflet' {
  import { ComponentType, ReactNode } from 'react';
  import { Map as LeafletMap } from 'leaflet';

  // Hook para acessar a instância do mapa
  export function useMap(): LeafletMap;

  // Componente MapContainer
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    children?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    whenCreated?: (map: LeafletMap) => void;
  }
  export const MapContainer: ComponentType<MapContainerProps>;
  
  // Componente TileLayer
  export interface TileLayerProps {
    url: string;
    attribution?: string;
    zIndex?: number;
    opacity?: number;
  }
  export const TileLayer: ComponentType<TileLayerProps>;
  
  // Componente FeatureGroup
  export interface FeatureGroupProps {
    children?: ReactNode;
  }
  export const FeatureGroup: ComponentType<FeatureGroupProps>;
}

// Declaração de tipo para Leaflet Draw
declare module 'leaflet-draw' {
  // Este módulo só precisa ser reconhecido pelo TypeScript, sem detalhes de implementação
} 