<template>
    <div class="home">
      <h1>Descubre Deliciosas Recetas</h1>
      <RecipeList />
    </div>
  </template>
  
  <script setup>
  import RecipeList from '@/components/RecipeList.vue'
  </script>
  
  <style scoped>
  .home {
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
  </style>