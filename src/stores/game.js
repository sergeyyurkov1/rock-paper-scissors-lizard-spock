import { defineStore } from "pinia";

export const useGameStore = defineStore({
  id: "game",
  state: () => ({
    selfPick: "",
    housePick: "",
    view: "GameOpen",
    winners: [],
    score: 0,
  }),
  getters: {
    getSelfPick: (state) => state.selfPick,
    getHousePick: (state) => state.housePick,

    getWinners: (state) => state.winners,
    getScore: (state) => state.score,

    houseWins: function () {
      return this.winners.includes("housePick") && this.winners.length === 1;
    },
    selfWins: function () {
      return this.winners.includes("selfPick") && this.winners.length === 1;
    },
    draw: function () {
      return this.winners.length > 1;
    },
  },
  actions: {
    setScore() {
      this.score += 1;
    },
    setView(view) {
      this.view = view;
    },
    async setSelfPick(pick) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            this.$patch({
              selfPick: pick,
            })
          ); // this.selfPick = pick
        }, 500);
      });
    },
    async setHousePick(pick) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            this.$patch({
              housePick: pick,
            })
          ); // this.housePick = pick
        }, 2000);
      });
    },
    setWinners(winners) {
      this.winners = winners;
    },
  },
});
