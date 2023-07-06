"use client";
import React, { useState } from "react";
import {
  Circle,
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import "dotenv";
import { Button } from "@/components/ui/Button";
import axiosClient from "@/utils/api";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/Input";

const center = { lat: -31.946492498979126, lng: 115.93577906638669 };

const radius = 500;
const libraries: Libraries = ["places"];

const fetchData = async (circleRadius: number, lat: number, lng: number) => {
  const { data } = await axiosClient.get(
    `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=F-e6AypVq0C-lIHVp6t_8AgoRYBTAPmcIr-n3Plv8Hg&limit=100&in=circle:${lat},${lng};r=${circleRadius.toFixed(
      0
    )}`
  );

  return data;
};

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API!,
    libraries: libraries,
  });

  const [showCircle, setShowCircle] = useState(false);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [circleCenter, setCircleCenter] = useState(center);
  const [circleRadius, setCircleRadius] = useState(radius);

  console.log(circleCenter);

  const containerStyle = {
    width: "100%",
    height: "600px",
    cursor: showCircle ? "pointer" : "default", // Change cursor style when hovering
  };

  const onCircleDragEnd = React.useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCircleCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, []);

  const onCircleRadiusChanged = () => {
    const newRadius = circle?.getRadius();
    if (newRadius) {
      setCircleRadius(newRadius);
    }
    //setCircleRadius(newRadius);
  };

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCircleCenter({
        ...circleCenter,
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      setShowCircle(true);
    }
  };

  const {
    isLoading,
    data: streets,
    refetch,
    isFetching,
  } = useQuery(
    ["streets", circleRadius, circleCenter.lat, circleCenter.lng],
    () => fetchData(circleRadius, circleCenter.lat, circleCenter.lng),
    {
      enabled: false,
      select: (data) => {
        const items = data.items;

        const localStreets: string[] = [];
        items.forEach((item: any) => {
          const streetName = item?.address?.street;

          if (streetName) {
            if (!localStreets.includes(streetName)) {
              localStreets.push(streetName);
            }
          }
        });

        return localStreets;
      },
      /*  onSuccess: (data) => {
        const items = data.items;

        const localStreets: string[] = [];
        items.forEach((item: any) => {
          const streetName = item?.address?.street;

          if (streetName) {
            if (!localStreets.includes(streetName)) {
              localStreets.push(streetName);
            }
            setStreets([...localStreets]);
          }
        });
      }, */
    }
  );

  console.log(streets);

  // function to fetch street names within circle
  const fetchStreetNames = () => {
    if (!circle) {
      toast({
        variant: "destructive",
        description: "Please select a location on the map.",
      });
      return;
    }

    refetch();
  };

  return isLoaded ? (
    <div className="w-[96%] md:w-full mx-auto flex flex-col gap-2 px-0 md:px-2">
      <Autocomplete
        onLoad={(ac) => {
          setAutoComplete(ac);
        }}
        onPlaceChanged={() => {
          if (autoComplete) {
            const place = autoComplete.getPlace();
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            if (lat && lng) {
              setShowCircle(true);
              setCircleCenter({ ...circleCenter, lat, lng });
            }
          }
        }}
        types={["address"]}
        restrictions={{ country: "au" }}
      >
        <Input
          placeholder="Search for a street"
          type="text"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={circleCenter}
        zoom={16}
        onClick={handleClick}
      >
        {showCircle && (
          <Circle
            onLoad={(circle) => {
              setCircle(circle);
            }}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
            }}
            center={circleCenter}
            radius={circleRadius}
            draggable={true}
            editable={true}
            onDragEnd={onCircleDragEnd}
            onRadiusChanged={onCircleRadiusChanged}
          />
        )}
      </GoogleMap>

      <Button
        className="mt-3"
        onClick={fetchStreetNames}
        isLoading={isLoading && isFetching}
        disabled={isLoading && isFetching}
      >
        Fetch Streets
      </Button>
      {streets && streets.length > 0 && (
        <div className="p-2 border border-border">{streets.join(",")}</div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center flex-1 w-full max-w-screen-lg mx-auto"></div>
  );
}
