// src/store/useStore.js
import { defineStore } from 'pinia';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const FETCH_ROUTES = gql`
  query {
    routes {
      id
      points {
        lat
        lng
      }
      subRoutes {
        id
        points {
          lat
          lng
        }
      }
    }
  }
`;

export const useStore = defineStore('main', {
  state: () => ({
    routes: [],
    loading: false,
  }),
  actions: {
    async fetchRoutes() {
      this.loading = true;
      const { result } = useQuery(FETCH_ROUTES);
      this.routes = await result.value.routes;
      this.loading = false;
    },
    calculateTotalDistance() {
      const calculateDistance = (points) => {
        const rad = (x) => (x * Math.PI) / 180;
        const R = 6378137; // Earth’s mean radius in meters

        let totalDistance = 0;

        for (let i = 1; i < points.length; i++) {
          const dLat = rad(points[i].lat - points[i - 1].lat);
          const dLong = rad(points[i].lng - points[i - 1].lng);

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(points[i - 1].lat)) *
              Math.cos(rad(points[i].lat)) *
              Math.sin(dLong / 2) *
              Math.sin(dLong / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          totalDistance += R * c;
        }

        return totalDistance;
      };

      const calculateRouteDistance = (route) => {
        let distance = calculateDistance(route.points);

        route.subRoutes.forEach((subRoute) => {
          distance += calculateRouteDistance(subRoute);
        });

        return distance;
      };

      let totalDistance = 0;

      this.routes.forEach((route) => {
        totalDistance += calculateRouteDistance(route);
      });

      return totalDistance;
    },
  },
});

export default useStore;
