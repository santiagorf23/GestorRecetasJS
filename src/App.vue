<template>
    <div id="app">
      <nav-bar />
      <div class="container">
        <h1>Gestor de Recetas</h1>
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import NavBar from './components/NavBar.vue'
  </script>
  
  <style>
  .container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  </style>