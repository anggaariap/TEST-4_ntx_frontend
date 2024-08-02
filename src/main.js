// src/main.js
import { createApp, provide, h } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';

const apolloClient = new ApolloClient({
  uri: 'https://sirefcode.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': 'jw8y3lwW7Vk4HKuROjlbs3flnrYaDsE1vkqNqhtTgv3rIo8bC655Fx6WmSZk4KvO',
  },
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(createPinia());
app.mount('#app');
