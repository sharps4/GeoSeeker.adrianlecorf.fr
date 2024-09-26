const validate2 = document.getElementById("validate2");

export function setupMap(location) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39, lng: 34 },
    streetViewControl: false,
    zoom: 2.5,
  });
  validate2.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(validate2);
  
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: location,
      pov: {
        heading: 34,
        pitch: 10,
        zoom: 0,
      },
      zoomControl: false,
      addressControl: false,
      showRoadLabels: false,
      panControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
      },
    }
  );

  console.log('Map and panorama setup at:', location);
  return { map, panorama };
}

export function addMarker(location, map, previousMarker) {
  if (previousMarker) {
    previousMarker.setMap(null);
    console.log('Previous marker removed');
  }

  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(40, 40)
    }
  });

  console.log('New marker added at:', location);
  return marker;
}
