<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? 'Edit' : 'Tambah' }} Resep Masakan</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="race.nama" label="Nama Resep" label-placement="floating" placeholder="Masukkan nama resep"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea v-model="race.langkah" label="Langkah" label-placement="floating" placeholder="Masukkan langkah-langkah" :autogrow="true" :rows="3"></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button type="button" @click="submitForm" shape="round" color="primary" expand="block">
            {{ editingId ? 'Edit' : 'Tambah' }} Resep Masakan
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
  IonTextarea,
  IonDatetime,
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Race, firestoreService } from '@/utils/firestore';
import { watch, ref } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  race: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'update:editingId': [value: string | null];
  'submit': [item: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>];
}>();

const cancel = () => {
  emit('update:isOpen', false);
  emit('update:editingId', null);
  resetRace();
};

const submitForm = () => {
  emit('submit', props.race);
  cancel();
};

const resetRace = () => {
  props.race.nama = '';
  props.race.langkah = '';
};

// Watch editingId for changes
watch(
  () => props.editingId,
  async (newEditingId) => {
    if (newEditingId) {
      try {
        const race = await firestoreService.getRaceById(newEditingId);
        if (race) {
          props.race.nama = race.nama;
          props.race.langkah = race.langkah;
        }
      } catch (error) {
        console.error('Failed to fetch race data:', error);
      }
    } else {
      resetRace();
    }
  },
  { immediate: true }
);
</script>