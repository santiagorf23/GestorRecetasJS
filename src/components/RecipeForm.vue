<template>
    <form @submit.prevent="saveRecipe">
      <input type="text" v-model="recipe.name" placeholder="Nombre de la receta" required />
      <textarea v-model="recipe.description" placeholder="Descripción"></textarea>
      <button type="submit">Guardar</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        recipe: { name: '', description: '' },
      };
    },
    methods: {
      saveRecipe() {
        console.log('Receta guardada:', this.recipe);
      },
    },
  };
  </script>
    