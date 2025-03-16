'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  comparables: {
    lat: number;
    lng: number;
    address: string;
    rent: number;
    distance: number;
  }[];
}

export default function PropertyMap({ center, comparables }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if no map container or already loaded
    if (!mapRef.current || mapLoaded) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key is missing');
      console.error('Google Maps API key is missing');
      return;
    }

    // Validate center coordinates
    if (!center || 
        typeof center.lat !== 'number' || 
        typeof center.lng !== 'number' || 
        isNaN(center.lat) || 
        isNaN(center.lng) ||
        Math.abs(center.lat) > 90 || 
        Math.abs(center.lng) > 180) {
      setError('Invalid map coordinates');
      console.error('Invalid map coordinates:', center);
      return;
    }

    console.log('Creating map with center:', center);

    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      setMapLoaded(true);
      
      if (!mapRef.current) return;
      
      // Create the map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });
      
      setMap(mapInstance);
      
      // Create an info window
      const infoWindowInstance = new google.maps.InfoWindow();
      setInfoWindow(infoWindowInstance);
      
      // Add subject property marker
      const subjectMarker = new google.maps.Marker({
        position: center,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4ade80', // Green
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Your Property',
      });
      
      // Add info window for subject property
      subjectMarker.addListener('click', () => {
        if (infoWindowInstance) {
          infoWindowInstance.setContent(`
            <div style="color: black; padding: 5px;">
              <strong>Your Property</strong>
            </div>
          `);
          infoWindowInstance.open(mapInstance, subjectMarker);
        }
      });
    }).catch(err => {
      console.error('Error loading Google Maps:', err);
      setError('Failed to load Google Maps: ' + err.message);
    });
  }, [center, mapLoaded]);
  
  // Add comparable property markers when map and comparables are available
  useEffect(() => {
    if (!map || !infoWindow) return;
    
    // Filter out invalid comparables
    const validComparables = comparables.filter(comp => 
      comp && 
      typeof comp.lat === 'number' && 
      typeof comp.lng === 'number' && 
      !isNaN(comp.lat) && 
      !isNaN(comp.lng) &&
      Math.abs(comp.lat) <= 90 && 
      Math.abs(comp.lng) <= 180
    );
    
    if (validComparables.length === 0) {
      console.warn('No valid comparable properties with coordinates');
      return;
    }
    
    console.log(`Adding ${validComparables.length} comparable markers`);
    
    validComparables.forEach((comp, index) => {
      const marker = new google.maps.Marker({
        position: { lat: comp.lat, lng: comp.lng },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6', // Blue
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: comp.address,
      });
      
      // Add info window for comparable property
      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="color: black; padding: 5px;">
            <strong>${comp.address}</strong><br>
            Rent: $${comp.rent.toLocaleString()}/mo<br>
            Distance: ${comp.distance} miles
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });
  }, [map, infoWindow, comparables]);
  
  if (error) {
    return (
      <div className="h-[400px] w-full rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <p className="font-semibold">Error loading map</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={mapRef} className="h-[400px] w-full rounded-md overflow-hidden" />
  );
} 