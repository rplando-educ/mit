import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { IoNavigateOutline, IoStar } from 'react-icons/io5';
import { ACCESSIBILITY_FEATURES, DEFAULT_CENTER } from '../utils/constants';
import { calculateAccessibilityScore } from '../utils/scoring';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick?.(event.latlng);
    },
  });
  return null;
}

function RecenterOnPosition({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 15));
    }
  }, [map, position]);

  return null;
}

export default function MapComponent({ locations, onSelectLocation, onMapClick, selectedPosition, userPosition }) {
  const center = useMemo(() => userPosition || selectedPosition || DEFAULT_CENTER, [selectedPosition, userPosition]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-[360px] lg:h-[520px]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnPosition position={selectedPosition || userPosition} />
        <MapClickHandler onMapClick={onMapClick} />
        {userPosition && (
          <Marker position={userPosition} icon={markerIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {selectedPosition && (
          <Marker position={selectedPosition} icon={markerIcon}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
        {locations.map((location) => {
          const position = [Number(location.latitude), Number(location.longitude)];
          if (Number.isNaN(position[0]) || Number.isNaN(position[1])) return null;

          return (
            <Marker key={location.id} position={position} icon={markerIcon} eventHandlers={{ click: () => onSelectLocation?.(location) }}>
              <Popup>
                <div className="w-[min(16rem,70vw)] space-y-2">
                  {location.photos?.[0] && <img src={location.photos[0]} alt="" className="h-28 w-full rounded-md object-cover" />}
                  <h3 className="text-base font-bold">{location.placeName}</h3>
                  <p className="text-sm text-slate-600">{location.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-amber-600">
                      <IoStar /> {Number(location.rating || 0).toFixed(1)}
                    </span>
                    <span className="font-semibold text-brand-700">Score {calculateAccessibilityScore(location)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(location.features || []).map((id) => (
                      <span key={id} className="rounded bg-slate-100 px-2 py-1 text-[11px]">
                        {ACCESSIBILITY_FEATURES.find((item) => item.id === id)?.label || id}
                      </span>
                    ))}
                  </div>
                  <button className="mt-2 flex items-center gap-1 font-semibold text-brand-700" onClick={() => onSelectLocation?.(location)}>
                    <IoNavigateOutline /> View details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
