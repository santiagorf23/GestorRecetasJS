<template>
    <div class="filters">
      <div class="filter-group">
        <label>Tiempo de preparación</label>
        <select v-model="filters.maxReadyTime">
          <option value="">Todos</option>
          <option value="15">15 minutos o menos</option>
          <option value="30">30 minutos o menos</option>
          <option value="60">1 hora o menos</option>
        </select>
      </div>
  
      <div class="filter-group">
        <label>Dieta</label>
        <select v-model="filters.diet">
          <option value="">Todas</option>
          <option value="vegetarian">Vegetariana</option>
          <option value="vegan">Vegana</option>
          <option value="gluten-free">Sin gluten</option>
        </select>
      </div>
  
      <button @click="applyFilters">Aplicar filtros</button>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const filters = reactive({
    maxReadyTime: '',
    diet: ''
  })
  
  const emit = defineEmits(['filter'])
  
  const applyFilters = () => {
    emit('filter', filters)
  }
  </script>