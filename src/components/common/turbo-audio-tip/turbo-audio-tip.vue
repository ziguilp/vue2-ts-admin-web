<template>
  <audio
    ref="audio"
    style="height: 0; width: 0"
    :src="src"
    v-if="src"
    autoplay
    @ended="audioEnd"
  ></audio>
</template>

<script >
export default {
  name: "turbo-audio-tip-component",
  props: {
    src: {
      type: String,
    },
  },
  methods: {
    play(src) {
      this.src = src;
    },
    audioEnd() {
      this.src = "";
    },
  },
};
</script>