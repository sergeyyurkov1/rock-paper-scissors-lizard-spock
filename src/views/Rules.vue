<script>
export default {
  name: "Rules",
  emits: ["closeRules"],
};
</script>

<template>
  <div
    class="absolute inset-0 left-1/2 top-1/2 z-20 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 flex-col place-content-around items-center bg-white md:h-[400px] md:w-[400px] md:rounded-3xl"
  >
    <div
      class="flex h-24 w-full flex-col justify-end md:pl-9 md:pb-1"
      id="title"
    >
      <p
        class="text-center text-3xl font-bold uppercase text-dark-text md:text-left"
      >
        Rules
      </p>
    </div>

    <div
      class="flex aspect-square w-[300px]"
      style="
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image: url('./src/assets/images/image-rules-bonus.svg');
      "
      id="rules"
    ></div>

    <div id="close" class="flex h-24 flex-col justify-center">
      <span
        @click="$emit('closeRules')"
        class="h-5 w-5 border-header-outline uppercase text-header-outline hover:cursor-pointer md:absolute md:top-12 md:right-9"
        style="
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          background-image: url('./src/assets/images/icon-close.svg');
        "
      >
      </span>
    </div>
  </div>
</template>
