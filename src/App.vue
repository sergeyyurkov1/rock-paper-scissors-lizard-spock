<script>
import { storeToRefs } from "pinia";

import Game from "@/views/Game.vue";
import GameOpen from "@/views/GameOpen.vue";
import Rules from "@/views/Rules.vue";

import { useGameStore } from "@/stores/game";
import RPSLS, { stringClassMap } from "@/RPSLS";

export default {
  setup() {
    const store = useGameStore();

    const { getSelfPick, getHousePick } = storeToRefs(store);

    return { store, getSelfPick, getHousePick };
  },
  components: {
    Game,
    GameOpen,
    Rules,
  },
  data() {
    return {
      showRules: false,
    };
  },
  // watch: {
  //   getSelfPick() {
  //     this.store.setView("Game");
  //   },
  //   getHousePick() {
  //     this.playGame();
  //   },
  // },
  mounted() {
    this.store.$subscribe((mutation) => {
      let payload = mutation.payload;

      if ("selfPick" in payload && Object.keys(payload).length === 1)
        this.store.setView("Game");
      if ("housePick" in payload && Object.keys(payload).length === 1)
        this.playGame();
    });
  },
  methods: {
    playGame() {
      let choices = {
        selfPick: stringClassMap[this.store.getSelfPick],
        housePick: stringClassMap[this.store.getHousePick],
      };

      let game = new RPSLS(choices);
      game.play();

      this.store.setWinners(game.winners);
    },
    toggleRules() {
      this.showRules = !this.showRules;
    },
  },
};
</script>

<template>
  <main
    id="container"
    class="relative flex h-full flex-col place-content-around items-center"
  >
    <section
      class="flex max-h-24 w-4/5 justify-between rounded-xl border-2 border-header-outline p-2 text-4xl text-header-outline md:min-h-[150px] md:w-3/5 md:p-4"
    >
      <div class="m-2">
        <img class="h-full" src="/images/logo-bonus.svg" alt="" />
      </div>

      <div
        id="score"
        class="flex flex-col items-center justify-center rounded-md bg-white px-4 py-2 shadow-sm md:w-32"
      >
        <h2 class="text-sm uppercase text-score-text md:text-base">Score</h2>

        <span class="text-4xl font-bold text-dark-text md:text-6xl">{{
          this.store.getScore
        }}</span>
      </div>
    </section>
    <div id="component-container" class="">
      <Transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        mode="out-in"
      >
        <component :is="this.store.view"></component>
      </Transition>
    </div>

    <Transition>
      <Rules @close-rules="toggleRules" v-if="showRules" />
    </Transition>

    <div
      id="button-container"
      class="flex h-24 flex-col justify-center md:mr-8 md:h-0 md:justify-end md:self-end"
    >
      <button
        @click="toggleRules"
        class="rounded-md border-2 border-header-outline px-10 py-2 uppercase text-white transition duration-200 ease-in-out hover:bg-header-outline"
      >
        Rules
      </button>
    </div>
  </main>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
