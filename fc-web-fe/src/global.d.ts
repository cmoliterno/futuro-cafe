// Declaração global para importações de imagens
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

// Declaração para importação de módulos dinâmicos
declare module 'leaflet' {
  const L: any;
  export = L;
  export as namespace L;
}

declare module 'leaflet-draw' {
  const LeafletDraw: any;
  export = LeafletDraw;
  export as namespace LeafletDraw;
}

// Declarações para ambiente
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Permitir importação de arquivos CSS
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Permitir o uso de require como uma função
declare function require(path: string): any; 