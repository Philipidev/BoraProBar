import React, { useRef, useEffect, useState } from "react";

// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "mapbox-gl";
import styled from "styled-components";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
//@ts-ignore
// import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'; 
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { RulerControl, CompassControl, ZoomControl } from 'mapbox-gl-controls';
// import MapboxDirections. 'react-map-gl-directions/dist/mapbox-gl-directions.css'

mapboxgl.accessToken = "pk.eyJ1IjoicGhpbGlwaSIsImEiOiJja21pbGpwaHUwaWpnMm9xbWlmbnU4enF3In0.WvrEXDS3uzd6OHta5_aG8g";
//var MapboxDirections = require('@mapbox/mapbox-gl-directions');


export default function MapaMaxBox() {
  // The following is required to stop "npm build" from transpiling mapbox code.
  // @ts-ignore
  // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
  mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


  const [mapHeight, setMapHeight] = useState(window.innerHeight - 17);
  const [mapWidth, setMapWidth] = useState(window.innerWidth - 20);

  window.addEventListener('resize', (e) => {
    setMapHeight(window.innerHeight - 17);
    setMapWidth(window.innerWidth - 20);
  });
  const mapContainerRef = useRef<any>();
  const mapRef = useRef<mapboxgl.Map>();
  const geocoderRef = useRef<MapboxGeocoder>();
  const directionsRef = useRef<any>();
  const [lng, setLng] = useState(-43.95319);
  const [lat, setLat] = useState(-19.90823);
  const [zoom, setZoom] = useState(14);
  const [pitch, setPitch] = useState(0);
  const [bearing, setBearing] = useState(0);

  const popup = new mapboxgl.Popup({ closeButton: false });
  const marker = new mapboxgl.Marker({
    color: 'red',
    scale: 0.8,
    draggable: false,
    pitchAlignment: 'auto',
    rotationAlignment: 'auto'
  })
    // .setLngLat([-43.95319, -19.90823])
    // .setPopup(popup)

  const InicializeMapOnlyOnce = () => {
    if (mapRef.current) return; // initialize map only once
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      style: 'mapbox://styles/mapbox/streets-v11',
    });
    mapRef.current.on('move', onMapMove);
    mapRef.current.on('load', onMapLoad);
  }
  useEffect(InicializeMapOnlyOnce);

  const onMapLoad = (event: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData) => {
    if (!mapRef.current) return;

    // marker.addTo(mapRef.current)
    //   .togglePopup();

    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapRef.current,
      marker: marker,
    })
    // mapRef.current.addControl(geocoderRef.current);
    geocoderRef.current.on('results', (e) => {
      console.log('asdsad2')
      console.log(e)
    })
    geocoderRef.current.on('result', (e) => {
      console.log('asdsad1')
      console.log(e)
    })
   
    // directionsRef.current = new MapboxDirections({
    //   accessToken: mapboxgl.accessToken,
    //   unit: 'metric',
    //   profile: 'mapbox/cycling',
    // });

    // mapRef.current.addControl(directionsRef.current, 'top-right');
    mapRef.current.addControl(new RulerControl(), 'bottom-right');
    mapRef.current.addControl(new CompassControl(), 'bottom-right');
    mapRef.current.addControl(new ZoomControl(), 'bottom-right');
    document.getElementById('geocoder-meu-mapa')!.appendChild(geocoderRef.current.onAdd(mapRef.current));
  };

  const onMapMove = (event: mapboxgl.MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & mapboxgl.EventData) => {
    if (!mapRef.current) return;
    setLat(+mapRef.current.getCenter().lat.toFixed(5));
    setLng(+mapRef.current.getCenter().lng.toFixed(5));
    setPitch(+mapRef.current.getPitch().toFixed(5));
    setBearing(+mapRef.current.getBearing().toFixed(5));
    setZoom(+mapRef.current.getZoom().toFixed(1));
  };

  return (
    <WrapperMapa
      windowWidth={mapWidth}
      windowHeight={mapHeight}
    >
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}
        <div id="geocoder-meu-mapa">

        </div>
      </div>
      <div ref={mapContainerRef} className="map-container-ref" />
    </WrapperMapa>
  );
}

const WrapperMapa = styled.div<{ windowWidth: number, windowHeight: number }>`
  .sidebar {
    background-color: rgba(35, 55, 75, 0.9);
    color: #fff;
    padding: 6px 12px;
    font-family: monospace;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    margin: 12px;
    border-radius: 4px;
  }

  /* .mapboxgl-ctrl-geocoder--icon-search {
    left: 89% !important;
  } */

  .map-container-ref{
    width: ${props => props.windowWidth}px;
    height: ${props => props.windowHeight}px;
  }
`;
