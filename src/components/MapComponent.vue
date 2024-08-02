<template>
    <div id="map" ref="map" style="height: 100vh;"></div>
  </template>
  
  <script>
  import L from 'leaflet';
  import { ref, onMounted } from 'vue';
  import { useStore } from '../store/useStore';
  import 'leaflet/dist/leaflet.css';
  import markerIcon from '../assets/marker.png';
  
  export default {
    setup() {
      const map = ref(null);
      const store = useStore();
  
      onMounted(async () => {
        await store.fetchRoutes();
  
        map.value = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map.value);
  
        const customIcon = L.icon({
          iconUrl: markerIcon,
          iconSize: [38, 38],
        });
  
        store.routes.forEach((route) => {
          route.points.forEach((point) => {
            L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map.value);
          });
        });
  
        const totalDistance = store.calculateTotalDistance();
        console.log(`Total Distance: ${totalDistance} meters`);
      });
  
      return {
        map,
      };
    },
  };
  </script>
  
  <style scoped>
  #map {
    height: 100%;
    width: 100%;
  }
  </style>
  