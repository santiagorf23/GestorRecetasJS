<template>
  <div class="recipe-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando detalles de la receta...</p>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Recipe details -->
    <div v-else-if="recipe" class="recipe-detail">
      <div class="recipe-header">
        <h1>{{ recipe.title }}</h1>
        <button 
          @click="toggleFavorite" 
          :class="['favorite-btn', { 'is-favorite': isFavorite }]"
        >
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>

      <div class="recipe-meta">
        <span>🕒 {{ recipe.readyInMinutes }} minutos</span>
        <span>👥 {{ recipe.servings }} porciones</span>
        <span>💚 {{ recipe.healthScore }}% saludable</span>
      </div>

      <div class="recipe-image">
        <img :src="recipe.image" :alt="recipe.title">
      </div>

      <div class="recipe-summary" v-html="recipe.summary"></div>

      <div class="recipe-sections">
        <!-- Ingredients -->
        <div class="ingredients-section">
          <h2>Ingredientes</h2>
          <ul class="ingredients-list">
            <li v-for="ingredient in recipe.extendedIngredients" 
                :key="ingredient.id">
              <span class="ingredient-amount">
                {{ ingredient.amount }} {{ ingredient.unit }}
              </span>
              {{ ingredient.name }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="instructions-section">
          <h2>Instrucciones</h2>
          <ol class="instructions-list">
            <li v-for="(step, index) in recipe.analyzedInstructions[0]?.steps" 
                :key="index">
              {{ step.step }}
            </li>
          </ol>
        </div>

        <!-- Additional Info -->
        <div class="additional-info">
          <h2>Información Adicional</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Vegetariano:</span>
              <span>{{ recipe.vegetarian ? 'Sí' : 'No' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Vegano:</span>
              <span>{{ recipe.vegan ? 'Sí' : 'No' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Sin Gluten:</span>
              <span>{{ recipe.glutenFree ? 'Sí' : 'No' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Sin Lácteos:</span>
              <span>{{ recipe.dairyFree ? 'Sí' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Recipes -->
      <div v-if="similarRecipes.length" class="similar-recipes">
        <h2>Recetas Similares</h2>
        <div class="similar-recipes-grid">
          <div v-for="similar in similarRecipes" 
               :key="similar.id" 
               class="similar-recipe-card"
               @click="loadRecipe(similar.id)">
            <img :src="getSimilarRecipeImage(similar.id)" :alt="similar.title">
            <h3>{{ similar.title }}</h3>
            <p>🕒 {{ similar.readyInMinutes }} min</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const route = useRoute()
const router = useRouter()

const recipe = ref(null)
const loading = ref(true)
const error = ref(null)
const similarRecipes = ref([])
const favorites = ref([])

const isFavorite = computed(() => {
  return favorites.value.some(fav => fav.id === recipe.value?.id)
})

const loadRecipe = async (id) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: {
        apiKey: API_KEY
      }
    })
    recipe.value = response.data
    loadSimilarRecipes(id)
  } catch (err) {
    error.value = 'Error al cargar la receta: ' + err.message
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const loadSimilarRecipes = async (id) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/similar`, {
      params: {
        apiKey: API_KEY,
        number: 4
      }
    })
    similarRecipes.value = response.data
  } catch (err) {
    console.error('Error loading similar recipes:', err)
  }
}

const getSimilarRecipeImage = (id) => {
  return `https://spoonacular.com/recipeImages/${id}-312x231.jpg`
}

const toggleFavorite = () => {
  const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  
  if (isFavorite.value) {
    favorites.value = savedFavorites.filter(fav => fav.id !== recipe.value.id)
  } else {
    favorites.value = [...savedFavorites, recipe.value]
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

onMounted(async () => {
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  await loadRecipe(route.params.id)
})
</script>

<style scoped>
.recipe-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recipe-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.recipe-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
}

.recipe-image {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-summary {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.recipe-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredients-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.ingredient-amount {
  color: #4CAF50;
  font-weight: bold;
  margin-right: 10px;
}

.instructions-list {
  padding-left: 20px;
}

.instructions-list li {
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
}

.similar-recipes {
  margin-top: 40px;
}

.similar-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.similar-recipe-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.similar-recipe-card:hover {
  transform: translateY(-5px);
}

.similar-recipe-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.similar-recipe-card h3 {
  padding: 10px;
  margin: 0;
  font-size: 1rem;
}

.similar-recipe-card p {
  padding: 0 10px 10px;
  margin: 0;
  color: #666;
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

@media (max-width: 768px) {
  .recipe-sections {
    grid-template-columns: 1fr;
  }
  
  .recipe-header h1 {
    font-size: 1.5rem;
  }
  
  .recipe-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>