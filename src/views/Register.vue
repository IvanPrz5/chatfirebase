<template>
  <v-container>
    <v-img class="mx-auto my-10" max-width="250"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="0" max-width="448" rounded="lg">
      <v-form ref="formRegister" fast-fail @submit.prevent>
        <v-row no-gutters>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Nombre" prepend-inner-icon="mdi-account-outline" variant="outlined"
              v-model="usuario.nombre"></v-text-field>
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Apellido Paterno" prepend-inner-icon="mdi-account-outline"
              variant="outlined" v-model="usuario.apPaterno"></v-text-field>
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Correo Electrónico" prepend-inner-icon="mdi-email-outline"
              variant="outlined" v-model="usuario.email"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" label="Ingresa tu contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible" v-model="usuario.password"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn block class="mb-5" color="info" size="large" variant="tonal" @click="register()">
        Registrarse
      </v-btn>
      <v-card-text class="text-center registerLink">
        <a class="text-blue text-decoration-none" rel="noopener noreferrer" @click="toLogin()">
          Ya tienes una cuenta?
        </a>
      </v-card-text>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card color="success">
      <v-card-text>
        El usuario se registro exitosamente. Seras redireccionado al Login.
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snack" :timeout="2050" :color="snackColor">
    {{ msg }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { database } from "../firebaseconfig";
import * as firestore from "firebase/firestore";

const router = useRouter();
const formRegister = ref(null) as any;
let visible: any = ref(false);
const dialog: any = ref(false);
const snack: any = ref(false);
let snackColor = "";
let msg: String = "";
let usuario: any = ref({
  nombre: "",
  apPaterno: "",
  email: "",
  password: "",
  image: "https://cdn.vuetifyjs.com/images/john.jpg",
  status: true
});

async function register() {
  await firestore
    .addDoc(firestore.collection(database, "usuarios"), usuario.value)
    .then(() => {
      dialog.value = true;
      setTimeout(toLogin, 2200);
    })
    .catch((e) => {
      console.log(e);
    });
}

function toLogin() {
  router.push({ path: "/login" });
}
</script>
