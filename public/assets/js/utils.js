export function generateRandomCoords() {
  let lat = Math.random() * (90 - -90) + -90;
  let lng = Math.random() * (180 - -180) + -180;
  return new google.maps.LatLng(lat, lng);
}

export function generateRandomCoordsFrance() {
  let lat = Math.random() * (51.124 - 41.303) + 41.303;
  let lng = Math.random() * (9.662 - -5.266) + -5.266;
  return new google.maps.LatLng(lat, lng);
}

export function generateRandomCoordsRomania() {
  let lat = Math.random() * (48.2654 - 43.6187) + 43.6187;
  let lng = Math.random() * (29.6340 - 20.2202) + 20.2202;
  return new google.maps.LatLng(lat, lng);
}
