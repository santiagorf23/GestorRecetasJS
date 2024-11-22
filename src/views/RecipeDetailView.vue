<template>
    <div class="recipe-detail" v-if="recipe">
      <div class="recipe-header">
        <h1>{{ recipe.title }}</h1>
        <button @click="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
          <i class="fas fa-heart"></i>
        </button>
      </div>
  
      <div class="recipe-info">
        <img :src="recipe.image" :alt="recipe.title">
        
        <div class="recipe-meta">
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ recipe.readyInMinutes }} minutos</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-user"></i>
            <span>{{ recipe.servings }} porciones</span>
          </div>
        </div>
  
        <div class="ingredients">
          <h2>Ingredientes</h2>
          <ul>
            <li v-for="ingredient in recipe.extendedIngredients" 
                :key="ingredient.id">
              {{ ingredient.original }}
            </li>
          </ul>
        </div>
  
        <div class="instructions">
          <h2>Instrucciones</h2>
          <div v-html="recipe.instructions"></div>
        </div>
      </div>
    </div>
  
    <div v-else-if="loading" class="loading">
      Cargando...
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRecipeStore } from '@/stores/recipeStore'
  import { recipeService } from '@/services/api'
  
  const route = useRoute()
  const store = useRecipeStore()
  const recipe = ref(null)
  const loading = ref(true)
  
  const isFavorite = computed(() => 
    store.getFavoriteById(parseInt(route.params.id))
  )
  
  const toggleFavorite = () => {
    store.toggleFavorite(recipe.value)
  }
  
  onMounted(async () => {
    try {
      const response = await recipeService.getRecipeById(route.params.id)
      recipe.value = response.data
    } catch (error) {
      console.error('Error loading recipe:', error)
    } finally {
      loading.value = false
    }
  })
  </script>