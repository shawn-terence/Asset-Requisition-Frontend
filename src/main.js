import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { createVuetify } from 'vuetify/lib/framework.mjs';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'; 

import './assets/main.css'; 

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

app.use(router);
app.use(vuetify);
app.mount('#app');
