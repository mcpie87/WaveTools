import L from 'leaflet';
import { getPMTilesInstance } from './sourceCache';
import { getLayerName, getPMTilesUrl } from './urlUtils';
import { getLayerHash, getOffset } from './manifest';

const ZOOM = 14;

export class PMTileLayer extends L.TileLayer {
  private readonly pmtiles: ReturnType<typeof getPMTilesInstance>;
  private readonly offset: { x: number; y: number };
  private readonly version: string;

  constructor(url: string, options: L.TileLayerOptions = {}) {
    super('', options);
    this.version = getLayerHash(getLayerName(url));
    this.pmtiles = getPMTilesInstance(getPMTilesUrl(url), this.version);
    this.offset = getOffset();
  }

  createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const img = document.createElement('img');
    img.setAttribute('role', 'presentation');

    const tx = coords.x + this.offset.x;
    const ty = -coords.y + this.offset.y;

    this.pmtiles
      .getZxy(ZOOM, tx, ty)
      .then((tile) => {
        if (!tile) { done(new Error('Tile not found'), img); return; }
        const objectUrl = URL.createObjectURL(new Blob([tile.data]));
        img.src = objectUrl;
        img.onload = () => { URL.revokeObjectURL(objectUrl); done(undefined, img); };
        img.onerror = (e) => { URL.revokeObjectURL(objectUrl); done(new Error(String(e)), img); };
      })
      .catch((e) => done(e instanceof Error ? e : new Error(String(e)), img));

    return img;
  }
}