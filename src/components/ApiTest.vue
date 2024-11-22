<template>
    <div class="api-test">
      <h2>Prueba de Conexión API</h2>
      
      <button @click="testConnection" :disabled="loading">
        {{ loading ? 'Probando...' : 'Probar Conexión' }}
      </button>
  
      <div v-if="error" class="error">
        {{ error }}
      </div>
  
      <div v-if="result" class="success">
        <p>¡Conexión exitosa!</p>
        <p>Receta encontrada: {{ result.recipes[0].title }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { testApiConnection } from '@/services/api'
  
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)
  
  const testConnection = async () => {
    loading.value = true
    error.value = null
    result.value = null
  
    try {
      const data = await testApiConnection()
      result.value = data
      console.log('Test exitoso:', data)
    } catch (err) {
      error.value = `Error: ${err.message}`
      console.error('Error en el test:', err)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .api-test {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px 0;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error {
    color: #ff4444;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ff4444;
    border-radius: 4px;
  }
  
  .success {
    color: #4CAF50;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #4CAF50;
    border-radius: 4px;
  }
  </style>