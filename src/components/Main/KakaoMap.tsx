import { Depths } from "@fluentui/react";
import { Button, Card, makeStyles } from "@fluentui/react-components";
import { LocationRegular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";

import { Marker, getMarkers } from "../../apis/marker";
import usePositionStore from "../../stores/position";
import { mainColor } from "../../styles/color";
import { contentMargin, headerHeight } from "../../styles/margin";

const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - ${headerHeight} - ${contentMargin})`,
    gap: "15px"
  },
  title: {
    display: "flex",
    alignItems: "baseline",
    marginTop: "68px",
    marginLeft: "8px"
  },
  titleKor: {
    fontSize: "48px",
    fontWeight: "bold"
  },
  titleEng: {
    fontSize: "20px",
    fontWeight: "bold",
    color: mainColor
  },
  position: {
    marginLeft: "auto",
    color: mainColor,
    fontSize: "14px",
    fontWeight: "bold"
  },
  map: {
    width: "100%",
    height: "100%",
    padding: 0,
    borderRadius: "20px",
    boxShadow: Depths.depth16
  },
  control: {
    position: "absolute",
    top: "14px",
    right: "14px",
    zIndex: 1
  }
});

function KakaoMap() {
  const styles = useStyle();

  const {
    latitude,
    longitude,
    zoomLevel,
    address,
    setLatitude,
    setLongitude,
    setZoomLevel,
    getCoords,
    getAddress
  } = usePositionStore();

  const mapRef = useRef<kakao.maps.Map>(null);

  const [markers, setMarkers] = useState<Marker[]>();

  useEffect(() => {
    if (latitude == 0 || longitude == 0) {
      getCoords();
    }
    getMarkers().then((data) => {
      setMarkers(data);
    });
  }, []);

  useEffect(() => {
    if (latitude != 0 && longitude != 0) {
      getAddress();
    }
  }, [latitude, longitude]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.titleKor}>지도</div>
        <div className={styles.titleEng}>MAP</div>
        <div className={styles.position}>
          <LocationRegular />
          {` ${address}`}
        </div>
      </div>
      <Card className={styles.map}>
        <Map
          ref={mapRef}
          center={{ lat: latitude, lng: longitude }}
          isPanto={true}
          level={zoomLevel}
          style={{ width: "100%", height: "100%" }}
          onDragEnd={(map) => {
            const center = map.getCenter();

            setLatitude(center.getLat());
            setLongitude(center.getLng());
          }}
          onZoomChanged={(map) => {
            setZoomLevel(map.getLevel());
          }}
        >
          <MarkerClusterer
            averageCenter={true}
            minLevel={7}
            onClusterclick={() => {
              const center = mapRef.current?.getCenter();

              if (center) {
                setLatitude(center.getLat());
                setLongitude(center.getLng());
              }
            }}
          >
            {markers?.map(({ lat, lng }, index) => (
              <MapMarker key={index} position={{ lat: lat, lng: lng }} />
            ))}
          </MarkerClusterer>
        </Map>
        <Button
          className={styles.control}
          shape="circular"
          onClick={() => {
            getCoords();
            mapRef.current?.setLevel(3);
          }}
        >
          현재 위치로
        </Button>
      </Card>
    </div>
  );
}

export default KakaoMap;
