import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";

import App from "./App.vue";

import "./assets/index.css";
import "animate.css";

const app = createApp(App);

app.use(createPinia());
app.use(MotionPlugin, {
  directives: {
    "pop-1": {
      initial: { scale: 0, opacity: 0 },
      enter: {
        scale: 1,
        opacity: 1,
        transition: {
          delay: 0,
          duration: 200,
        },
      },
      hovered: {
        scale: 1.1,
        transition: {
          delay: 0,
          duration: 200,
          ease: "easeInOut",
        },
      },
    },
  },
});

app.mount("#app");
