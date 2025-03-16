'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PropertyMapProps {
  address: string;
  comparableProperties?: Array<{
    address: string;
    price: number;
    distance: number;
  }>;
}

export default function PropertyMap({ address, comparableProperties }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(async (google) => {
      const geocoder = new google.maps.Geocoder();
      
      // Get coordinates for main property
      const response = await geocoder.geocode({ address });
      const location = response.results[0].geometry.location;
      
      const map = new google.maps.Map(mapRef.current!, {
        center: location,
        zoom: 14,
      });

      // Add marker for main property
      new google.maps.Marker({
        position: location,
        map,
        icon: {
          url: '/marker-main.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      // Add markers for comparable properties
      comparableProperties?.forEach(async (prop) => {
        const compResponse = await geocoder.geocode({ address: prop.address });
        const compLocation = compResponse.results[0].geometry.location;
        
        new google.maps.Marker({
          position: compLocation,
          map,
          icon: {
            url: '/marker-comp.png',
            scaledSize: new google.maps.Size(30, 30)
          }
        });
      });
    });
  }, [address, comparableProperties]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
} 