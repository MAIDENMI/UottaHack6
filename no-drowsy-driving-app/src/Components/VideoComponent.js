// VideoComponent.jsx
import React, { useState, useEffect } from "react";

const VideoComponent = () => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onmessage = (event) => {
      setImageSrc(`data:image/jpeg;base64,${event.data}`);
    };

    socket.onclose = () => console.log("WebSocket connection closed");

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="fixedTopLeft">
      <img
        src={imageSrc}
        alt="Video Stream"
        style={{ maxWidth: "60%", maxHeight: "60%" }}
      />
    </div>
  );
};

export default VideoComponent;
