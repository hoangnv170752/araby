"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  image: string | null;
  timings: Array<{ day: number; opening_time: string; closing_time: string }>;
  cuisines: string[];
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant | null) => void;
}

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#C9A84C" stroke="#0D1117" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#0D1117"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const restaurantIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#2A7F7F"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <text x="12" y="16" text-anchor="middle" font-size="10">🍽️</text>
    </svg>
  `),
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32],
});

const selectedRestaurantIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="32" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#C9A84C"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <text x="12" y="16" text-anchor="middle" font-size="10">🍽️</text>
    </svg>
  `),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

function MapController({ selectedRestaurant }: { selectedRestaurant: Restaurant | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedRestaurant) {
      map.flyTo([selectedRestaurant.lat, selectedRestaurant.lng], 15, {
        duration: 0.5,
      });
    }
  }, [selectedRestaurant, map]);

  return null;
}

export default function MapComponent({
  center,
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
}: MapComponentProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedRestaurant={selectedRestaurant} />

      {/* User location marker */}
      <Marker position={[center.lat, center.lng]} icon={userIcon}>
        <Popup>
          <div style={{ textAlign: "center" }}>
            <strong>📍 Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Restaurant markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.lat, restaurant.lng]}
          icon={selectedRestaurant?.id === restaurant.id ? selectedRestaurantIcon : restaurantIcon}
          eventHandlers={{
            click: () => onSelectRestaurant(restaurant),
          }}
        >
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <strong style={{ fontSize: "14px" }}>{restaurant.name}</strong>
              <p style={{ margin: "8px 0 4px", fontSize: "12px", color: "#666" }}>
                {restaurant.address}
              </p>
              <p style={{ margin: "4px 0", fontSize: "12px", color: "#2A7F7F" }}>
                📍 {restaurant.distance.toFixed(1)} km away
              </p>
              {restaurant.cuisines.length > 0 && (
                <p style={{ margin: "4px 0", fontSize: "11px", color: "#888" }}>
                  {restaurant.cuisines.join(", ")}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
