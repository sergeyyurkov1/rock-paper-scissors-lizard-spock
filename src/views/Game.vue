<script>
import Hand from "@/components/Hand.vue";
import Message from "@/views/Message.vue";

import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";

import { chooseRandomHand } from "@/RPSLS";

export default {
  setup() {
    const store = useGameStore();

    const { selfWins } = storeToRefs(store);

    return { store, selfWins };
  },
  name: "Game",
  components: {
    Hand,
    Message,
  },
  data() {
    return {};
  },
  mounted() {
    this.store.setHousePick(chooseRandomHand());
  },
  watch: {
    selfWins(value) {
      if (value === true) this.store.setScore();
    },
  },
};
</script>

<template>
  <section
    class="flex h-[300px] w-[300px] flex-col justify-between md:h-[300px] md:w-[800px]"
  >
    <div class="flex h-full flex-wrap">
      <div
        id="selfPick"
        class="flex flex-shrink flex-grow flex-col-reverse items-center justify-around md:order-1 md:flex-col"
      >
        <h2 class="mt-4 uppercase text-white md:mt-0 md:text-2xl">
          You Picked
        </h2>

        <span :class="this.store.selfWins ? 'animation-ping' : ''">
          <Hand :id="this.store.getSelfPick" view="Game" />
        </span>
      </div>

      <div
        id="housePick"
        class="flex max-w-[150px] flex-shrink flex-grow flex-col-reverse items-center justify-around md:order-3 md:max-w-none md:flex-col"
      >
        <h2 class="mt-4 uppercase text-white md:mt-0 md:text-2xl">
          The House Picked
        </h2>

        <div
          v-if="this.store.housePick === ''"
          class="animate__animated animate__pulse animate__infinite h-28 w-28 rounded-full bg-background-2 md:h-56 md:w-56"
        ></div>
        <span v-else :class="this.store.houseWins ? 'animation-ping' : ''">
          <Hand :id="this.store.housePick" view="Game" />
        </span>
      </div>

      <Transition>
        <Message v-if="this.store.selfWins" message="You Win" />
        <Message v-else-if="this.store.houseWins" message="You Lose" />
        <Message v-else-if="this.store.draw" message="A Draw" />
      </Transition>
    </div>
  </section>
</template>

<style>
.animation-ping {
  z-index: -1;
  border-radius: 100%;
  animation: animation 2s linear infinite;
}

/* prettier-ignore */
@keyframes animation {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0),
                0 0 0 0 rgba(255, 255, 255, 0),
                0 0 0 0 rgba(255, 255, 255, 0);
  }
  25% {
    box-shadow: 0 0 0 25px rgba(255, 255, 255, 0.05),
                0 0 0 0 rgba(255, 255, 255, 0),
                0 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 0 50px rgba(255, 255, 255, 0.1),
                0 0 0 25px rgba(255, 255, 255, 0.05),
                0 0 0 0 rgba(255, 255, 255, 0);
  }
  75% {
    box-shadow: 0 0 0 75px rgba(255, 255, 255, 0.05),
                0 0 0 50px rgba(255, 255, 255, 0.1),
                0 0 0 25px rgba(255, 255, 255, 0.1);
  }
  100% {
    box-shadow: 0 0 0 100px rgba(255, 255, 255, 0),
                0 0 0 75px rgba(255, 255, 255, 0),
                0 0 0 50px rgba(255, 255, 255, 0);
  }
}
</style>
