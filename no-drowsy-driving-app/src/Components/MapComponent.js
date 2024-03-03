import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"; // Import directions CSS
import axios from "axios";

// Your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoicnRpZXJyZSIsImEiOiJjbDg2OWM0b3IwOHExM3ZtcWR5MWlyaXpqIn0.CXyX38b-HvC9pt3kHQc_VA";

export default function MapComponent() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current) {
      // Initialize the map centered on Ottawa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-75.6972, 45.4215], // Ottawa, ON, Canada
        zoom: 13,
      });

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
      });

      map.current.on("load", () => {
        map.current.addControl(directions, "top-left");

        // Fetch and display EV charging stations near Ottawa
        fetchEVChargingStations();
      });
    }

    // Fetch EV charging stations and add markers
    const fetchEVChargingStations = async () => {
      const options = {
        method: "GET",
        url: "https://ev-charge-finder.p.rapidapi.com/search-by-location",
        params: { near: "Ottawa, ON, Canada", limit: "20" },
        headers: {
          "X-RapidAPI-Key":
            "cd19f935e1msh5743e34a54d2698p16a1d7jsnc88b71a19461",
          "X-RapidAPI-Host": "ev-charge-finder.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const stations = response.data.data; 
        console.log(stations);

        // Assuming `stations` is an array of station locations
        stations.forEach((station) => {
          console.log(station);
          new mapboxgl.Marker()
            .setLngLat([station.longitude, station.latitude])
            .addTo(map.current);
        });
      } catch (error) {
        console.error("Error fetching EV charging stations:", error);
      }
    };

    // Cleanup function to remove map on component unmount
    return () => map.current.remove();
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
