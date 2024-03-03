import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
// import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
// import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"; // Import directions CSS

mapboxgl.accessToken =
  "pk.eyJ1IjoicnRpZXJyZSIsImEiOiJjbDg2OWM0b3IwOHExM3ZtcWR5MWlyaXpqIn0.CXyX38b-HvC9pt3kHQc_VA";

export default function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-75.6996429, 45.4219327],
      zoom: 13,
    });

    // const directions = new MapboxDirections({
    //   accessToken: mapboxgl.accessToken,
    //   unit: "metric",
    //   profile: "mapbox/driving",
    // });

    // map.current.on("load", () => {
    //   map.current.addControl(directions, "top-right");
    // });

    return () => map.current && map.current.remove();
  }, []);

  return (
    <div className="map-container">
      <div className="map-section">
        <div
          ref={mapContainer}
          className="map-container"
          style={{ height: "100vh", width: "70vw" }}
        />
      </div>
    </div>
  );
}
