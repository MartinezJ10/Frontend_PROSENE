import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config.js'
import '@formkit/themes/genesis'; // Import the default theme

const app = createApp(App);

app.use(router);
app.use(plugin, defaultConfig(config))
app.mount("#app");
