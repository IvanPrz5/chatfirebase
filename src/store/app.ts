// Utilities
import { Usuario } from '@/Class/Usuario';
import { defineStore } from 'pinia';
import { ref } from "vue";

export const storeApp = defineStore('app', () => {
  const usuario : Usuario | null = new Usuario();
  const token = ref("");
  
  return {
    token,
    usuario,
  }
})
