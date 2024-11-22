<template>
    <div v-if="error" class="error-alert">
      <p>{{ error }}</p>
      <button @click="clearError">×</button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    error: String
  })
  
  const emit = defineEmits(['clear'])
  
  const clearError = () => {
    emit('clear')
  }
  </script>