<template>
    <div class="recipe-container">
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar recetas..."
          class="search-input"
        />
      </div>
  
      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando recetas...</p>
      </div>
  
      <!-- Error message -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
  
      <!-- Recipe grid -->
      <div v-else class="recipe-grid">
        <div v-for="recipe in recipes" 
             :key="recipe.id" 
             class="recipe-card">
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
              <button 
                @click="toggleFavorite(recipe)"
                :class="['btn-favorite', { 'is-favorite': isFavorite(recipe.id) }]"
              >
                ❤
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No results message -->
      <div v-if="!loading && recipes.length === 0" class="no-results">
        No se encontraron recetas. Intenta con otra búsqueda.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
  const router = useRouter()
  
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const favorites = ref([])
  
  // Función para cargar recetas aleatorias
  const loadRandomRecipes = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
        params: {
          apiKey: API_KEY,
          number: 12
        }
      })
      recipes.value = response.data.recipes
    } catch (err) {
      error.value = 'Error al cargar las recetas: ' + err.message
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Función para buscar recetas
  const searchRecipes = async (query) => {
    if (!query.trim()) {
      await loadRandomRecipes()
      return
    }
  
    loading.value = true
    error.value = null
  
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          apiKey: API_KEY,
          query: query,
          number: 12,
          addRecipeInformation: true
        }
      })
      recipes.value = response.data.results
    } catch (err) {
      error.value = 'Error en la búsqueda: ' + err.message
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Debounce para la búsqueda
  let searchTimeout
  const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      searchRecipes(searchQuery.value)
    }, 500)
  }
  
  // Navegación a detalles de receta
  const viewRecipe = (id) => {
    router.push(`/recipe/${id}`)
  }
  
  // Manejo de favoritos
  const toggleFavorite = (recipe) => {
    const index = favorites.value.findIndex(fav => fav.id === recipe.id)
    if (index === -1) {
      favorites.value.push(recipe)
    } else {
      favorites.value.splice(index, 1)
    }
    // Guardar en localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }
  
  const isFavorite = (id) => {
    return favorites.value.some(recipe => recipe.id === id)
  }
  
  // Cargar favoritos al montar el componente
  onMounted(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }
    loadRandomRecipes()
  })
  </script>
  
  <style scoped>
  .recipe-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    border-color: #4CAF50;
    outline: none;
  }
  
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .recipe-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s;
  }
  
  .recipe-card:hover {
    transform: translateY(-5px);
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
    font-size: 1.2rem;
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
    justify-content: space-between;
    gap: 10px;
  }
  
  .btn-view {
    flex: 1;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-view:hover {
    background-color: #45a049;
  }
  
  .btn-favorite {
    padding: 8px;
    background: none;
    border: none;
    font-size: 24px;
    color: #ddd;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  .btn-favorite.is-favorite {
    color: #ff4444;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    color: #ff4444;
    text-align: center;
    padding: 20px;
  }
  
  .no-results {
    text-align: center;
    padding: 40px;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .recipe-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  </style>