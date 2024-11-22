<template>
    <div class="favorites">
      <h1>Mis Recetas Favoritas</h1>
  
      <div v-if="!favorites.length" class="no-favorites">
        <p>Aún no tienes recetas favoritas</p>
        <router-link to="/" class="btn-explore">
          Explorar Recetas
        </router-link>
      </div>
  
      <div v-else class="favorites-grid">
        <div 
          v-for="recipe in favorites" 
          :key="recipe.id" 
          class="recipe-card"
        >
          <img :src="recipe.image" :alt="recipe.title">
          <div class="recipe-content">
            <h3>{{ recipe.title }}</h3>
            <p class="recipe-info">
              <span>🕒 {{ recipe.readyInMinutes }} min</span>
              <span>👥 {{ recipe.servings }} porciones</span>
            </p>
            <div class="recipe-actions">
              <button @click="viewRecipe(recipe.id)" class="btn-view">
                Ver Detalles
              </button>
              <button @click="removeFromFavorites(recipe.id)" class="btn-remove">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const favorites = ref([])
  
  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }
  }
  
  const removeFromFavorites = (id) => {
    favorites.value = favorites.value.filter(recipe => recipe.id !== id)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }
  
  const viewRecipe = (id) => {
    router.push(`/recipe/${id}`)
  }
  
  onMounted(() => {
    loadFavorites()
  })
  </script>
  
  <style scoped>
  .favorites {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .no-favorites {
    text-align: center;
    padding: 40px;
  }
  
  .btn-explore {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  .btn-explore:hover {
    background-color: #45a049;
  }
  
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .recipe-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .recipe-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .recipe-content {
    padding: 15px;
  }
  
  .recipe-content h3 {
    margin: 0 0 10px 0;
  }
  
  .recipe-info {
    display: flex;
    gap: 15px;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
  
  .recipe-actions {
    display: flex;
    gap: 10px;
  }
  
  .btn-view, .btn-remove {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-view {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-remove {
    background-color: #ff4444;
    color: white;
  }
  
  .btn-view:hover {
    background-color: #45a049;
  }
  
  .btn-remove:hover {
    background-color: #ff3333;
  }
  
  @media (max-width: 768px) {
    .favorites-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  </style>