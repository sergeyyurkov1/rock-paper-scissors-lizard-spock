<script>
import Hand from "@/components/Hand.vue";

import { useGameStore } from "@/stores/game";

export default {
  setup() {
    const store = useGameStore();

    return { store };
  },
  name: "GameOpen",
  components: {
    Hand,
  },
  methods: {
    onHandClick(event) {
      let pick = event.target.id;
      this.store.setSelfPick(pick);
    },
  },
};
</script>

<template>
  <section
    class="relative h-[300px] w-[200px] md:h-[300px] md:w-[300px]"
    style="
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      background-image: url('./src/assets/images/bg-pentagon.svg');
    "
  >
    <div
      id="scissors-container"
      class="absolute top-[60px] left-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform md:top-[30px]"
    >
      <Hand v-motion-pop-1 @click="onHandClick" id="scissors" view="GameOpen" />
    </div>

    <div
      id="rock-container"
      class="absolute bottom-[60px] right-[40px] h-fit w-fit translate-x-1/2 translate-y-1/2 transform md:right-[50px] md:bottom-[20px]"
    >
      <Hand v-motion-pop-1 @click="onHandClick" id="rock" view="GameOpen" />
    </div>

    <div
      id="paper-container"
      class="absolute top-[30px] right-[0px] h-fit w-fit translate-x-1/2 translate-y-1/2 transform md:top-[-5px] md:right-[0px]"
    >
      <Hand v-motion-pop-1 @click="onHandClick" id="paper" view="GameOpen" />
    </div>

    <div
      id="lizard-container"
      class="absolute bottom-[60px] left-[40px] h-fit w-fit -translate-x-1/2 translate-y-1/2 transform md:left-[50px] md:bottom-[20px]"
    >
      <Hand v-motion-pop-1 @click="onHandClick" id="lizard" view="GameOpen" />
    </div>

    <div
      id="spock-container"
      class="absolute top-[30px] left-[0px] h-fit w-fit -translate-x-1/2 translate-y-1/2 transform md:top-[-5px] md:right-[0px]"
    >
      <Hand v-motion-pop-1 @click="onHandClick" id="spock" view="GameOpen" />
    </div>
  </section>
</template>
