<template>
  <v-container>
    <v-img class="mx-auto my-10" max-width="250"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-form ref="formLogin" fast-fail @submit.prevent>
        <v-row no-gutters>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"
              v-model="credenciales.email"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" label="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible" v-model="credenciales.password"
              @keyup.enter="login()"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn block class="mb-5" color="info" size="large" variant="tonal" @click="login()">
        Iniciar Sesión
      </v-btn>
      <v-card-text class="text-center registerLink">
        <a class="text-blue text-decoration-none" rel="noopener noreferrer" @click="register()">
          Registrate Aquí <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { storeApp } from '@/store/app';
import { useRouter } from "vue-router";
import { ref } from "vue";
import { database } from "../firebaseconfig";
import * as firestore from "firebase/firestore";
import { Usuario } from '@/Class/Usuario';

const appStore = storeApp();
const router = useRouter();
let visible: any = ref(false);
let credenciales: any = ref({
  email: "maperlbr@gmail.com",
  password: "Esteban5",
});

async function login() {
  try {
    const collec = firestore.collection(database, "usuarios")
    const q = firestore.query(collec, 
      firestore.where("email", "==", credenciales.value.email),
      firestore.where("password", "==", credenciales.value.password),
      firestore.where("status", "==", true));
    const snapQuery = await firestore.getDocs(q);
    snapQuery.forEach((doc) => {
      localStorage.setItem("token", doc.id)
      appStore.usuario = <Usuario> doc.data();
      localStorage.setItem("usuario", JSON.stringify(<Usuario> doc.data()));
      router.push({ path: "/" });
    })
  } catch (error) {
    console.log(error)
  }
}
function register() {
  router.push({ path: "/register" });
}
</script>

<style>
.registerLink {
  cursor: pointer;
}
</style>
