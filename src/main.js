import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config.js'
import '@formkit/themes/genesis'; // Import the default theme
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'


const app = createApp(App);

app.use(router);
app.use(plugin, defaultConfig(config))
app.mount("#app");
