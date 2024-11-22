import axios from 'axios'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const BASE_URL = 'https://api.spoonacular.com/recipes'

// Crear instancia de axios
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY
  }
})

// Componente de prueba para verificar la conexión
export const testApiConnection = async () => {
  try {
    const response = await api.get('/random', {
      params: {
        number: 1
      }
    })
    console.log('Conexión exitosa:', response.data)
    return response.data
  } catch (error) {
    console.error('Error de conexión:', error)
    throw error
  }
}

export const recipeService = {
  searchRecipes(query) {
    return api.get('/complexSearch', {
      params: {
        query,
        number: 12
      }
    })
  }
}