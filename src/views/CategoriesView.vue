<template>
    <div class="categories">
      <h1>Categorías de Recetas</h1>
  
      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando categorías...</p>
      </div>
  
      <!-- Categories grid -->
      <div v-else class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-card"
          @click="showRecipesByCategory(category.title)"
        >
          <div class="category-image">
            <img :src="category.image" :alt="category.title">
          </div>
          <div class="category-content">
            <h3>{{ category.title }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>
  
      <!-- Modal for category recipes -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ selectedCategory }}</h2>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="categoryRecipes.length" class="recipes-grid">
              <div 
                v-for="recipe in categoryRecipes" 
                :key="recipe.id" 
                class="recipe-card"
              >
                <img :src="recipe.image" :alt="recipe.title">
                <div class="recipe-content">
                  <h3>{{ recipe.title }}</h3>
                  <button @click="viewRecipe(recipe.id)" class="btn-view">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="loading">
              <div class="spinner"></div>
              <p>Cargando recetas...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
  const router = useRouter()
  
  const loading = ref(false)
  const categories = ref([])
  const showModal = ref(false)
  const selectedCategory = ref('')
  const categoryRecipes = ref([])
  
  // Lista predefinida de categorías con imágenes
  const predefinedCategories = [
    {
      id: 1,
      title: 'Italiana',
      description: 'Pastas, pizzas y más',
      image: 'https://spoonacular.com/recipeImages/italian-cuisine.jpg'
    },
    {
      id: 2,
      title: 'Mexicana',
      description: 'Tacos, enchiladas y más',
      image: 'https://spoonacular.com/recipeImages/mexican-cuisine.jpg'
    },
    // Añade más categorías aquí
  ]
  
  const loadCategories = async () => {
    loading.value = true
    try {
      // Por ahora usamos categorías predefinidas
      categories.value = predefinedCategories
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      loading.value = false
    }
  }
  
  const showRecipesByCategory = async (category) => {
    selectedCategory.value = category
    showModal.value = true
    categoryRecipes.value = []
  
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: API_KEY,
          cuisine: category,
          number: 9,
          addRecipeInformation: true
        }
      })
      categoryRecipes.value = response.data.results
    } catch (error) {
      console.error('Error loading category recipes:', error)
    }
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedCategory.value = ''
    categoryRecipes.value = []
  }
  
  const viewRecipe = (id) => {
    router.push(`/recipe/${id}`)
    closeModal()
  }
  
  onMounted(() => {
    loadCategories()
  })
  </script>
  
  <style scoped>
  .categories {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .category-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
  }
  
  .category-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .category-content {
    padding: 15px;
  }
  
  .category-content h3 {
    margin: 0 0 10px 0;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  /* Resto de estilos... */
  </style>