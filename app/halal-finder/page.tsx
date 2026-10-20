"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic import for Leaflet (no SSR)
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div style={mapLoadingStyle}>
      <div style={{ color: "var(--muted)" }}>Loading map...</div>
    </div>
  ),
});

const INVITE_CODE_STORAGE_KEY = "araby_halal_invite_code";

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

interface Filters {
  is_open_now: boolean;
  is_food_truck: boolean;
  is_certified: boolean;
  is_zabiha_halal: boolean;
  radius: number;
}

const mapLoadingStyle: React.CSSProperties = {
  height: "400px",
  background: "var(--card)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--border)",
};

export default function HalalFinderPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [needsInviteCode, setNeedsInviteCode] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    is_open_now: false,
    is_food_truck: false,
    is_certified: false,
    is_zabiha_halal: false,
    radius: 10,
  });

  // Request location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Please allow location access to find halal restaurants near you");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An error occurred getting your location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const fetchRestaurants = useCallback(async (loadMore = false, withInviteCode?: string) => {
    if (!location) return;

    setLoading(true);
    setError(null);
    setInviteCodeError(null);

    try {
      // Get stored invite code
      const storedCode = typeof window !== "undefined"
        ? localStorage.getItem(INVITE_CODE_STORAGE_KEY)
        : null;
      const inviteCode = withInviteCode || storedCode;

      const res = await fetch("/api/halal-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          offset: loadMore ? offset : 0,
          limit: 20,
          inviteCode,
          ...filters,
        }),
      });

      if (res.status === 401) {
        setNeedsInviteCode(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch restaurants");
      }

      const data = await res.json();

      // Store invite code on success
      if (withInviteCode) {
        localStorage.setItem(INVITE_CODE_STORAGE_KEY, withInviteCode.toUpperCase());
      }
      setNeedsInviteCode(false);

      if (loadMore) {
        setRestaurants((prev) => [...prev, ...data.restaurants]);
      } else {
        setRestaurants(data.restaurants);
      }
      setHasMore(data.hasMore);
      setOffset((prev) => (loadMore ? prev + 20 : 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  }, [location, offset, filters]);

  const handleInviteCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      setInviteCodeError("Please enter an invite code");
      return;
    }
    await fetchRestaurants(false, inviteCodeInput.trim());
    if (needsInviteCode) {
      setInviteCodeError("Invalid or expired invite code");
    }
  };

  // Fetch when location is available
  useEffect(() => {
    if (location) {
      fetchRestaurants();
    }
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key: keyof Filters, value: boolean | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setOffset(0);
    fetchRestaurants();
  };

  const isOpen = (timings: Restaurant["timings"]) => {
    const now = new Date();
    const day = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const todayTiming = timings.find((t) => t.day === day);
    if (!todayTiming || todayTiming.opening_time === "00:00" && todayTiming.closing_time === "00:00") {
      return false;
    }

    return currentTime >= todayTiming.opening_time && currentTime <= todayTiming.closing_time;
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <a href="/" style={logoStyle}>
          <span style={{ fontSize: "24px" }}>&#127769;</span>
          <span className="font-amiri" style={{ color: "var(--gold)" }}>
            أرابي <span style={{ color: "var(--white)" }}>· Araby</span>
          </span>
        </a>
        <h1 style={titleStyle}>Halal Finder</h1>
      </header>

      <main style={mainStyle}>
        {/* Location Error */}
        {locationError && (
          <div style={errorBoxStyle}>
            <span style={{ fontSize: "20px" }}>📍</span>
            <div>
              <strong>Location Required</strong>
              <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>{locationError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={retryButtonStyle}
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        {location && !needsInviteCode && (
          <div style={filtersContainerStyle}>
            <div style={filtersRowStyle}>
              <label style={filterLabelStyle}>
                <input
                  type="checkbox"
                  checked={filters.is_open_now}
                  onChange={(e) => handleFilterChange("is_open_now", e.target.checked)}
                  style={checkboxStyle}
                />
                Open Now
              </label>
              <label style={filterLabelStyle}>
                <input
                  type="checkbox"
                  checked={filters.is_certified}
                  onChange={(e) => handleFilterChange("is_certified", e.target.checked)}
                  style={checkboxStyle}
                />
                Certified
              </label>
              <label style={filterLabelStyle}>
                <input
                  type="checkbox"
                  checked={filters.is_zabiha_halal}
                  onChange={(e) => handleFilterChange("is_zabiha_halal", e.target.checked)}
                  style={checkboxStyle}
                />
                Zabiha
              </label>
              <label style={filterLabelStyle}>
                <input
                  type="checkbox"
                  checked={filters.is_food_truck}
                  onChange={(e) => handleFilterChange("is_food_truck", e.target.checked)}
                  style={checkboxStyle}
                />
                Food Trucks
              </label>
              <select
                value={filters.radius}
                onChange={(e) => handleFilterChange("radius", parseInt(e.target.value))}
                style={selectStyle}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
              <button onClick={applyFilters} style={applyButtonStyle} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* Invite Code Required */}
        {needsInviteCode && (
          <div style={inviteCodeBoxStyle}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "48px" }}>🔐</span>
              <h2 style={{ margin: "16px 0 8px", color: "var(--gold)" }}>Invite Code Required</h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                This feature is available to waitlist members. Enter your invite code to continue.
              </p>
            </div>
            <form onSubmit={handleInviteCodeSubmit} style={inviteCodeFormStyle}>
              <input
                type="text"
                placeholder="Enter your invite code"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                style={inviteCodeInputStyle}
                maxLength={8}
              />
              <button type="submit" style={inviteCodeButtonStyle} disabled={loading}>
                {loading ? "Verifying..." : "Submit"}
              </button>
            </form>
            {inviteCodeError && (
              <p style={{ color: "#f87171", textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
                {inviteCodeError}
              </p>
            )}
            <p style={{ color: "var(--muted)", textAlign: "center", marginTop: "16px", fontSize: "13px" }}>
              Don&apos;t have a code? <a href="/#waitlist" style={{ color: "var(--gold)" }}>Join the waitlist</a>
            </p>
          </div>
        )}

        {/* Error */}
        {error && !needsInviteCode && (
          <div style={apiErrorStyle}>
            {error}
          </div>
        )}

        {/* Map */}
        {location && !needsInviteCode && (
          <div style={mapContainerStyle}>
            <MapComponent
              center={location}
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
            />
          </div>
        )}

        {/* Restaurant List */}
        {restaurants.length > 0 && (
          <div style={listContainerStyle}>
            <h2 style={listTitleStyle}>
              {restaurants.length} Halal Restaurant{restaurants.length !== 1 ? "s" : ""} Found
            </h2>
            <div style={listGridStyle}>
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  style={{
                    ...cardStyle,
                    borderColor: selectedRestaurant?.id === restaurant.id ? "var(--gold)" : "var(--border)",
                  }}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  {restaurant.image && (
                    <div style={cardImageContainerStyle}>
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={cardImageStyle}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div style={cardContentStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>{restaurant.name}</h3>
                      <span style={isOpen(restaurant.timings) ? openBadgeStyle : closedBadgeStyle}>
                        {isOpen(restaurant.timings) ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p style={cardAddressStyle}>{restaurant.address}</p>
                    <div style={cardFooterStyle}>
                      <span style={distanceStyle}>
                        📍 {restaurant.distance.toFixed(1)} km
                      </span>
                      {restaurant.cuisines.length > 0 && (
                        <div style={cuisinesStyle}>
                          {restaurant.cuisines.slice(0, 2).map((cuisine) => (
                            <span key={cuisine} style={cuisineTagStyle}>
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => fetchRestaurants(true)}
                disabled={loading}
                style={loadMoreButtonStyle}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && location && restaurants.length === 0 && !error && (
          <div style={emptyStateStyle}>
            <span style={{ fontSize: "48px" }}>🍽️</span>
            <h3 style={{ color: "var(--text)", margin: "16px 0 8px" }}>No restaurants found</h3>
            <p style={{ color: "var(--muted)" }}>Try adjusting your filters or increasing the search radius</p>
          </div>
        )}

        {/* Loading State */}
        {loading && restaurants.length === 0 && (
          <div style={emptyStateStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: "var(--muted)", marginTop: "16px" }}>Finding halal restaurants near you...</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Styles
const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--night)",
  color: "var(--text)",
};

const headerStyle: React.CSSProperties = {
  padding: "16px 24px",
  borderBottom: "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  gap: "24px",
  background: "rgba(13,17,23,0.95)",
  backdropFilter: "blur(12px)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  fontSize: "18px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 600,
  color: "var(--gold)",
  margin: 0,
};

const mainStyle: React.CSSProperties = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const errorBoxStyle: React.CSSProperties = {
  background: "rgba(220, 38, 38, 0.1)",
  border: "1px solid rgba(220, 38, 38, 0.3)",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
};

const retryButtonStyle: React.CSSProperties = {
  marginLeft: "auto",
  padding: "8px 16px",
  background: "var(--gold)",
  color: "var(--night)",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
};

const filtersContainerStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "24px",
};

const filtersRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
};

const filterLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "var(--text)",
  fontSize: "14px",
  cursor: "pointer",
};

const checkboxStyle: React.CSSProperties = {
  accentColor: "var(--gold)",
  width: "16px",
  height: "16px",
};

const selectStyle: React.CSSProperties = {
  background: "var(--night)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
};

const applyButtonStyle: React.CSSProperties = {
  marginLeft: "auto",
  padding: "8px 20px",
  background: "var(--gold)",
  color: "var(--night)",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
};

const apiErrorStyle: React.CSSProperties = {
  background: "rgba(220, 38, 38, 0.1)",
  border: "1px solid rgba(220, 38, 38, 0.3)",
  borderRadius: "8px",
  padding: "12px 16px",
  color: "#f87171",
  marginBottom: "24px",
};

const mapContainerStyle: React.CSSProperties = {
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
  marginBottom: "24px",
  border: "1px solid var(--border)",
};

const listContainerStyle: React.CSSProperties = {
  marginTop: "24px",
};

const listTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "16px",
  color: "var(--text)",
};

const listGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "16px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "2px solid var(--border)",
  borderRadius: "12px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "border-color 0.2s, transform 0.2s",
};

const cardImageContainerStyle: React.CSSProperties = {
  height: "160px",
  overflow: "hidden",
  background: "var(--night)",
};

const cardImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardContentStyle: React.CSSProperties = {
  padding: "16px",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "8px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--text)",
  margin: 0,
  lineHeight: 1.3,
};

const openBadgeStyle: React.CSSProperties = {
  background: "rgba(42, 127, 127, 0.2)",
  color: "var(--teal-light)",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: 600,
  flexShrink: 0,
};

const closedBadgeStyle: React.CSSProperties = {
  background: "rgba(138, 143, 154, 0.2)",
  color: "var(--muted)",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: 600,
  flexShrink: 0,
};

const cardAddressStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--muted)",
  margin: "0 0 12px",
  lineHeight: 1.4,
};

const cardFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
};

const distanceStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--gold)",
  fontWeight: 500,
};

const cuisinesStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
};

const cuisineTagStyle: React.CSSProperties = {
  background: "rgba(201, 168, 76, 0.1)",
  color: "var(--gold)",
  padding: "3px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: 500,
};

const loadMoreButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "200px",
  margin: "24px auto 0",
  padding: "12px 24px",
  background: "transparent",
  border: "1px solid var(--border)",
  color: "var(--text)",
  borderRadius: "8px",
  fontWeight: 500,
  cursor: "pointer",
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
};

const spinnerStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "3px solid var(--border)",
  borderTopColor: "var(--gold)",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
};

const inviteCodeBoxStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "400px",
  margin: "40px auto",
};

const inviteCodeFormStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
};

const inviteCodeInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 16px",
  background: "var(--night)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
  fontSize: "16px",
  fontFamily: "monospace",
  letterSpacing: "2px",
  textTransform: "uppercase",
};

const inviteCodeButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  background: "var(--gold)",
  color: "var(--night)",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};
