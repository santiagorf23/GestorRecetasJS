import { defineStore } from 'pinia'
import { recipeService } from '@/services/api'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [],
    loading: false,
    error: null,
    favorites: []
  }),

  actions: {
    async searchRecipes(query) {
      this.loading = true
      this.error = null
      try {
        const response = await recipeService.searchRecipes(query)
        this.recipes = response.data.results
        console.log('Resultados:', response.data) // Para debug
      } catch (error) {
        this.error = 'Error al buscar recetas: ' + error.message
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    async getRandomRecipes() {
      this.loading = true
      this.error = null
      try {
        const response = await recipeService.getRandomRecipes(12)
        this.recipes = response.data.recipes
      } catch (error) {
        this.error = 'Error al cargar recetas aleatorias: ' + error.message
      } finally {
        this.loading = false
      }
    }
  }
})