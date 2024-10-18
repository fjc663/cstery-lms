<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
*, *::after, *::before {
  margin: 0;                 /* 清除所有元素的默认外边距 */
  padding: 0;                /* 清除所有元素的默认内边距 */
  box-sizing: border-box;     /* 使元素的宽高包含padding和border，控制布局 */
  /* user-select: none;         禁止用户选中文字 */
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

</style>

