import React from "react";
import MapGL from "react-map-gl";

const MapComponent = () => {
  const viewport = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    width: "100vw",
    height: "100vh",
  };

  return (
    <MapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken="pk.eyJ1IjoicnRpZXJyZSIsImEiOiJjbDg2OWM0b3IwOHExM3ZtcWR5MWlyaXpqIn0.CXyX38b-HvC9pt3kHQc_VA"
    />
  );
};

export default MapComponent;
