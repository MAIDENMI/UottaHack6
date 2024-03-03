import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import axios from "axios"; // Import Axios
import * as turf from "@turf/turf";

// Your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoicnRpZXJyZSIsImEiOiJjbDg2OWM0b3IwOHExM3ZtcWR5MWlyaXpqIn0.CXyX38b-HvC9pt3kHQc_VA";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const directions = useRef(null);
  const [startPoint, setStartPoint] = useState(null);

  // Function to calculate distance
  const calculateDistance = (markerCoordinates) => {
    if (!startPoint) return null;

    const from = turf.point([startPoint.lng, startPoint.lat]);
    const to = turf.point(markerCoordinates);
    const options = { units: "kilometers" };
    const distance = turf.distance(from, to, options);

    return distance.toFixed(2); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ev-charge-finder.p.rapidapi.com/search-by-location",
          {
            params: { near: "Ottawa, ON, Canada", limit: "20" },
            headers: {
              "X-RapidAPI-Key":
                "f3efbeafaemshf9fc7edbf9cebc2p1eee87jsna9de504fd121",
              "X-RapidAPI-Host": "ev-charge-finder.p.rapidapi.com",
            },
          }
        );

        response.data.data.forEach((station) => {
          const coordinates = [station.longitude, station.latitude];
          const description = station.name;

          // Create a marker
          const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map.current);

            console.log("Marker hovered:", description);

          // Add popup on marker hover
          marker.getElement().addEventListener("mouseenter", () => {
            const distanceToStartPoint = calculateDistance(coordinates); // Calculate distance to starting point
            const distanceMessage = distanceToStartPoint
              ? `Distance to starting point: ${distanceToStartPoint} km`
              : "Starting point not set";

            const descriptionWithDistance = distanceToStartPoint
              ? `${description}<br/><strong>${distanceMessage}</strong>` // Add a break line and make the distance bold
              : description;

            new mapboxgl.Popup({ offset: 15 })
              .setLngLat(coordinates)
              .setHTML(descriptionWithDistance)
              .addTo(map.current);

            // Log distance to starting point to the console
            console.log(distanceMessage);
          });
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Initialize the map
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-75.689764, 45.420119], // Ottawa center coordinates
        zoom: 11.15,
      });

      directions.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
      });

      map.current.addControl(directions.current, "top-right");

      directions.current.on("route", (e) => {
        const origin = e.route[0].legs[0].steps[0].maneuver.location;
        setStartPoint({
          lat: origin[1],
          lng: origin[0],
        });

        fetchData(); // Call fetchData after the starting point is set
      });
    }
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
