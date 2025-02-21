import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config.js'

const app = createApp(App);

app.use(router);
app.use(plugin, defaultConfig(config))
app.mount("#app");
