// Allow importing CSS files and other static assets in TypeScript
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// For libraries that ship only JS but have @types available separately
// Note: Do NOT declare 'leaflet' here — prefer the installed @types/leaflet package.
