<script>
export default {
  data() {
    return {
      idClassMap: {
        colors: {
          scissors: "bg-gradient-to-b from-scissors-2 to-scissors-1",
          paper: "bg-gradient-to-b from-paper-2 to-paper-1",
          rock: "bg-gradient-to-b from-rock-2 to-rock-1",
          lizard: "bg-gradient-to-b from-lizard-2 to-lizard-1",
          spock: "bg-gradient-to-b from-spock-2 to-spock-1",
        },
      },
      viewClassMap: {
        GameOpen: {
          size: {
            parent: "h-24 w-24 md:h-32 md:w-32",
            child: "h-16 w-16 md:h-20 md:w-20",
            icon: "h-10 w-10 md:h-12 md:w-12",
          },
          shadow: {
            parent: "shadow-inset-b-sm md:shadow-inset-b",
            child: "shadow-inset-sm md:shadow-inset",
          },
        },
        Game: {
          size: {
            parent: "h-28 w-28 md:h-56 md:w-56",
            child: "h-20 w-20 md:h-40 md:w-40",
            icon: "h-12 w-12 md:h-24 md:w-24",
          },
          shadow: {
            parent: "shadow-inset-b-sm md:shadow-inset-b",
            child: "shadow-inset-sm md:shadow-inset",
          },
        },
      },
    };
  },
  props: ["id", "view", "animation"],
  name: "Hand",
};
</script>

<template>
  <div
    :id="id"
    :class="`${animation} z-10 cursor-pointer rounded-full shadow-xl`"
  >
    <div
      id="parent"
      :class="`pointer-events-none ${idClassMap.colors[id]} ${viewClassMap[view].size.parent} ${viewClassMap[view].shadow.parent} flex items-center justify-center rounded-full`"
    >
      <div
        id="child"
        :class="`pointer-events-none ${viewClassMap[view].size.child} ${viewClassMap[view].shadow.child} flex items-center justify-center rounded-full bg-white opacity-90`"
      >
        <img
          :class="`${viewClassMap[view].size.icon} pointer-events-none`"
          :src="`/images/icon-${id}.svg`"
        />
      </div>
    </div>
  </div>
</template>
