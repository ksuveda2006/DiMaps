import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MAP_API_KEY = "AIzaSyBSpXYvvK3u-Fn9vmn2NY3dUCDJYL8Gcp0"; // Replace with your actual API key

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 40.7128, // Default center of the map (New York City)
  lng: -74.006,
};

const Map = () => {
  const [accessibleRestrooms, setAccessibleRestrooms] = useState([]);
  const [accessibleRamps, setAccessibleRamps] = useState([]);
  const [accessibleEntrances, setAccessibleEntrances] = useState([]);
  const [map, setMap] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onMapClick = (event) => {
    placeMarker(event.latLng);
  };

  const customMarkerUrl = "https://cdn-icons-png.flaticon.com/512/93/93191.png"; // Custom marker URL
  const customMarkerSize = { width: 40, height: 40 }; // Custom marker size

  useEffect(() => {
    if (!map) return;

    const fetchAccessibleLocations = async () => {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      const request = {
        location: center,
        radius: 15000,
        keyword:
          "public restroom, restroom, bathroom, accessible bathroom, wheelchair ramp, accessible entrance, accessible ramp",
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const restrooms = results.filter(
            (place) =>
              place.name.toLowerCase().includes("bathroom") ||
              place.name.toLowerCase().includes("restroom") ||
              place.name.toLowerCase().includes("accessible")
          );
          const ramps = results.filter(
            (place) =>
              place.name.toLowerCase().includes("wheelchair ramp") ||
              place.name.toLowerCase().includes("accessible ramp")
          );
          const entrances = results.filter((place) =>
            place.name.toLowerCase().includes("accessible entrance")
          );

          setAccessibleRestrooms(restrooms);
          setAccessibleRamps(ramps);
          setAccessibleEntrances(entrances);
        } else {
          console.error("Failed to fetch accessible locations", status);
        }
      });
    };

    fetchAccessibleLocations();
  }, [map]);

  useEffect(() => {
    if (map) {
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
    }
  }, [map]);

  const placeMarker = (location) => {
    if (!startMarker) {
      setStartMarker(
        new window.google.maps.Marker({
          position: location,
          map,
          title: "Start Location",
          draggable: true,
        })
      );
      setStartLocation(location);
    } else if (!endMarker) {
      setEndMarker(
        new window.google.maps.Marker({
          position: location,
          map,
          title: "End Location",
          draggable: true,
        })
      );
      setEndLocation(location);
    } else {
      endMarker.setPosition(location);
      setEndLocation(location);
    }

    if (startLocation && endLocation) {
      calculateRoute();
    }
  };

  const calculateRoute = () => {
    if (!startLocation || !endLocation) {
      alert("Please select both a starting and a destination location.");
      return;
    }

    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: "WALKING",
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
        provideVoiceInstructions(result);
      } else {
        alert("Directions request failed: " + status);
      }
    });
  };

  const provideVoiceInstructions = (result) => {
    const route = result.routes[0];
    const legs = route.legs;
    let stepIndex = 0;

    const speakStep = () => {
      if (stepIndex < legs[0].steps.length) {
        const step = legs[0].steps[stepIndex];
        const action = step.instructions.toLowerCase();
        const distance = step.distance.text;

        let direction = "";
        if (action.includes("left")) {
          direction = `Turn left in ${distance}`;
        } else if (action.includes("right")) {
          direction = `Turn right in ${distance}`;
        }

        if (direction) {
          const speech = new SpeechSynthesisUtterance(direction);
          window.speechSynthesis.speak(speech);
        }

        stepIndex++;
        setTimeout(speakStep, 5000);
      }
    };

    speakStep();
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(speechResult);
    };

    recognition.onerror = function (event) {
      alert("Error occurred in speech recognition: " + event.error);
    };
  };

  const processVoiceCommand = (command) => {
    const lowerCaseCommand = command.toLowerCase();

    if (lowerCaseCommand.includes("start at")) {
      const location = command.split("start at")[1].trim();
      alert(`Starting location set to: ${location}`);
      // You can add functionality to convert the spoken address to coordinates
    } else if (
      lowerCaseCommand.includes("end at") ||
      lowerCaseCommand.includes("destination")
    ) {
      const location =
        command.split("end at")[1]?.trim() ||
        command.split("destination")[1]?.trim();
      alert(`Destination set to: ${location}`);
      // You can add functionality to convert the spoken address to coordinates
    }

    if (startLocation && endLocation) {
      calculateRoute();
    }
  };

  return (
    <LoadScript googleMapsApiKey={MAP_API_KEY} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onClick={onMapClick}
      >
        {accessibleRestrooms.map((location) => {
          // Dynamically set the label based on place name
          const label =
            location.name.toLowerCase().includes("restroom") ||
            location.name.toLowerCase().includes("bathroom")
              ? "Restroom" // If the place name includes "restroom" or "bathroom", set the label to "Restroom"
              : location.name; // Otherwise, use the place's name as the label

          return (
            <Marker
              key={location.place_id}
              position={{
                lat: location.geometry.location.lat(),
                lng: location.geometry.location.lng(),
              }}
              label={label} // Dynamically set the label here
              icon={{
                url: customMarkerUrl,
                scaledSize: new window.google.maps.Size(
                  customMarkerSize.width,
                  customMarkerSize.height
                ),
              }}
            />
          );
        })}
        {accessibleRamps.map((location) => (
          <Marker
            key={location.place_id}
            position={{
              lat: location.geometry.location.lat(),
              lng: location.geometry.location.lng(),
            }}
            label={location.name}
            icon={{
              url: customMarkerUrl,
              scaledSize: new window.google.maps.Size(
                customMarkerSize.width,
                customMarkerSize.height
              ),
            }}
          />
        ))}
        {accessibleEntrances.map((location) => (
          <Marker
            key={location.place_id}
            position={{
              lat: location.geometry.location.lat(),
              lng: location.geometry.location.lng(),
            }}
            label={location.name}
            icon={{
              url: customMarkerUrl,
              scaledSize: new window.google.maps.Size(
                customMarkerSize.width,
                customMarkerSize.height
              ),
            }}
          />
        ))}
      </GoogleMap>
      <div
        id="panel"
        style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "#f4f4f4",
          borderTop: "2px solid #ddd",
        }}
      >
        <button onClick={calculateRoute}>Get Directions</button>
        <button
          id="voiceButton"
          onClick={startVoiceInput}
          style={{ marginLeft: "10px" }}
        >
          Start Voice Input
        </button>
      </div>
    </LoadScript>
  );
};

export default Map;
