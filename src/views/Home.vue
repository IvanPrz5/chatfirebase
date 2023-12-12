<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/lists/ali.png" 
        :title="appStore.usuario.nombre + ' ' + appStore.usuario.apPaterno" 
        :subtitle="appStore.usuario.email" nav>
        <template v-slot:append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
      <v-list v-for="i in arrayUsers" :key="i" density="compact" nav>
        <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg" :title="i.nombre" value="home"
          :subtitle="i.email" @click="seleccionaChat(i)">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-card class="d-flex flex-column fill-height mx-5" :elevation="0">
        <v-card-text id="prueba" v-if="mensajes.length > 0" style="height: 500px;" class="overflow-y-auto">
          <div v-for="i in mensajes" :key="i" :class="{
            'd-flex flex-row-reverse flex-column': i.from == 'maperlbr@gmail.com'
          }">
            <v-chip class="mt-2" :color="i.from == 'maperlbr@gmail.com' ? 'success' : 'info'">
              {{ i.text }}
            </v-chip>
          </div>
        </v-card-text>
        <div v-if="objectUser.id != null" style="border-radius: 5px;">
          <!-- <div class="text-subtitle-1 text-medium-emphasis">Escribe una nota:</div> -->
          <div class="d-flex">
            <v-text-field v-model="msj" @keyup.enter="enviarMsj()" density="compact" autofocus placeholder="Escribe un mensaje"></v-text-field>
            <v-btn size="small" color="success" class="ml-5" icon="mdi-send" @click="enviarMsj()"></v-btn>
          </div>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { storeApp } from '@/store/app';
import { database } from "../firebaseconfig";
import * as firestore from "firebase/firestore";

const appStore = storeApp();
let drawer: any = ref(true);
let rail: any = ref(true);
const router = useRouter();
let arrayUsers: any = ref([]);
let mensajes: any = ref([]);
let msj: any = ref();
let objectUser: any = ref({});

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (token != null) {
    let user: any = localStorage.getItem("usuario");
    appStore.usuario = JSON.parse(user);
  } else {
    router.push({ path: "/login" });
  }
})

onMounted(() => {
  getUsuarios()
})

async function getUsuarios() {
  try {
    console.log(appStore.usuario.email)
    const collec = firestore.collection(database, "usuarios")
    const q = firestore.query(collec,
      firestore.where("email", "!=", appStore.usuario.email),
      firestore.where("status", "==", true));
    const snapQuery = await firestore.getDocs(q);

    snapQuery.forEach((doc) => {
      arrayUsers.value.push({ ...doc.data(), id: doc.id })
    });
  } catch (error) {
    console.log(error)
  }
}

async function seleccionaChat(item: any) {
  mensajes.value = [];
  objectUser.value = item;

  firestore.onSnapshot(
    firestore.query(
      firestore.collection(database, 'chats/'),
      firestore.or(
        firestore.where("sala", "==", appStore.usuario.email + objectUser.value.email),
        firestore.where("sala", "==", objectUser.value.email + appStore.usuario.email),
      ),
      firestore.orderBy("timestamp", "asc")
    ),
    (snapshot) => {
      mensajes.value = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
    }
  )
}

async function enviarMsj() {
    const ref = firestore.collection(database, "chats");
    await firestore.addDoc(ref, {
      from: appStore.usuario.email,
      to: objectUser.value.email,
      text: msj.value,
      timestamp: firestore.serverTimestamp(),
      sala: appStore.usuario.email + objectUser.value.email
    })
    .then(() => {
      msj.value = "";
    })
    .catch((e) => {
      console.log(e);
    });
}
</script>
