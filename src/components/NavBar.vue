<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <!-- Removemos la imagen y solo dejamos el texto -->
        <span>Recipe App</span>
      </router-link>

      <div class="menu-toggle" @click="toggleMenu">
        <i class="fas fa-bars"></i>
      </div>

      <div class="nav-links" :class="{ active: isMenuOpen }">
        <router-link to="/">Inicio</router-link>
        <router-link to="/categories">Categorías</router-link>
        <router-link to="/favorites">
          Favoritos
          <span v-if="favoriteCount" class="badge">{{ favoriteCount }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'
import '../assets/styles/navbar.css'

const store = useRecipeStore()
const isMenuOpen = ref(false)

const favoriteCount = computed(() => store.favorites.length)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>