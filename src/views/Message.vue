<script>
import { useGameStore } from "@/stores/game";

export default {
  setup() {
    const store = useGameStore();

    return { store };
  },
  methods: {
    playAgain() {
      this.store.$patch({
        selfPick: "",
        housePick: "",
        view: "GameOpen",
        winners: [],
      });
    },
  },
  name: "Message",
  props: ["message"],
};
</script>

<template>
  <section
    class="mt-12 flex h-auto w-[300px] flex-shrink flex-grow flex-col items-center justify-around md:order-2 md:mt-0"
  >
    <h2 class="mb-5 text-6xl font-bold uppercase text-white md:mt-16 md:-mb-8">
      {{ message }}
    </h2>
    <button
      @click="playAgain"
      class="w-3/5 rounded-md border-2 border-white bg-white py-2 px-4 uppercase transition duration-200 ease-in-out hover:bg-opacity-0 hover:text-white md:mb-16"
    >
      Play Again
    </button>
  </section>
</template>
