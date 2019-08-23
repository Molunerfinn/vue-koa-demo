<template>
<!-- 锦囊 -->
<div class="SlideBox">
  <mt-swipe :auto="4000">
    <mt-swipe-item v-for="photo in slides" :key="photo.id"><img :src="photo.originalUrl" /></mt-swipe-item>
  </mt-swipe>
</div>
</template>

<script>

export default {
  data() {
    return {
    }
  }
}
