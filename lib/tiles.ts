// Leaflet xarita uchun: fon plitkalari zanjiri (biri ishlamasa keyingisiga o'tadi)
// va offline zaxira — O'zbekiston chegarasi (lib/uzb.json, ichki fayl, tarmoqqa bog'liq emas).
import uzb from "./uzb.json";

export type TileStatus = "loading" | "ok" | "offline";

const PROVIDERS = [
  {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
    maxZoom: 16,
    attribution: "Tiles &copy; Esri",
  },
  {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  },
];

/** Fon xaritasini qo'shadi. Qaytaradi: tozalash funksiyasi. */
export function attachBaseTiles(L: any, map: any, onStatus?: (s: TileStatus) => void): () => void {
  let idx = 0;
  let layer: any = null;
  let loaded = 0;
  let errors = 0;
  let stopped = false;

  const next = () => {
    if (stopped) return;
    idx += 1;
    if (idx < PROVIDERS.length) use(idx);
    else onStatus?.("offline");
  };

  const use = (i: number) => {
    if (layer) map.removeLayer(layer);
    loaded = 0;
    errors = 0;
    const p = PROVIDERS[i];
    layer = L.tileLayer(p.url, {
      maxZoom: p.maxZoom,
      subdomains: p.subdomains,
      attribution: p.attribution,
      crossOrigin: true,
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(map);
    layer.on("tileload", () => {
      loaded += 1;
      if (loaded === 1) onStatus?.("ok");
    });
    layer.on("tileerror", () => {
      errors += 1;
      // Hech qaysi plitka yuklanmagan bo'lsa — keyingi provayderga o'tamiz
      if (loaded === 0 && errors >= 3) next();
    });
  };

  onStatus?.("loading");
  use(0);
  return () => {
    stopped = true;
    if (layer) map.removeLayer(layer);
  };
}

/** O'zbekiston konturi (GeoJSON) — xarita ustida ingichka chiziq sifatida */
export function uzbOutline(L: any) {
  return L.geoJSON(uzb as any, {
    interactive: false,
    style: { color: "#2563eb", weight: 1.2, opacity: 0.55, fillColor: "#2563eb", fillOpacity: 0.05 },
  });
}
