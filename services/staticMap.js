const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export function generateStaticGoogleMap(address, comparables = [], width = 600, height = 400) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const markers = [`size:mid|color:red|label:P|${encodeURIComponent(address)}`];
  
  // Add markers for comparable properties
  comparables.forEach((comp, index) => {
    markers.push(`size:small|color:blue|label:${index + 1}|${encodeURIComponent(comp.address)}`);
  });

  const params = new URLSearchParams({
    center: encodeURIComponent(address),
    zoom: 14,
    size: `${width}x${height}`,
    maptype: 'roadmap',
    key: GOOGLE_MAPS_API_KEY,
  });

  markers.forEach(marker => params.append('markers', marker));

  return `${baseUrl}?${params.toString()}`;
}

export async function generateStaticMapboxMap(address, comparables = [], width = 600, height = 400) {
  // Convert address to coordinates
  const coordinates = await geocodeAddress(address);
  
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';
  
  // Create markers for the main property and comparables
  const markers = [`pin-l-home+ff0000(${coordinates.lng},${coordinates.lat})`];
  
  // Add markers for comparable properties
  for (const comp of comparables) {
    const compCoords = await geocodeAddress(comp.address);
    markers.push(`pin-s-building+0000ff(${compCoords.lng},${compCoords.lat})`);
  }

  const markersString = markers.join(',');
  
  // Center the map on the main property
  const center = `${coordinates.lng},${coordinates.lat},13`;
  
  return `${baseUrl}/${markersString}/${center}/${width}x${height}@2x?access_token=${MAPBOX_API_KEY}`;
}

async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

export function generateMapHtml(address, comparables = []) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          #map { height: 400px; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          function initMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 14,
              center: { lat: 0, lng: 0 }
            });
            
            const geocoder = new google.maps.Geocoder();
            
            // Add marker for main property
            geocoder.geocode({ address: '${address}' }, (results, status) => {
              if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                  map,
                  position: results[0].geometry.location,
                  icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  }
                });
              }
            });
            
            // Add markers for comparables
            ${comparables.map((comp, index) => `
              geocoder.geocode({ address: '${comp.address}' }, (results, status) => {
                if (status === 'OK') {
                  new google.maps.Marker({
                    map,
                    position: results[0].geometry.location,
                    label: '${index + 1}',
                    icon: {
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                  });
                }
              });
            `).join('\n')}
          }
        </script>
        <script async defer
          src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap">
        </script>
      </body>
    </html>
  `;
} 