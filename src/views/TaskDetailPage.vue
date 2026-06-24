<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Task Details</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card v-if="task" class="ion-margin">
        <ion-card-header>
          <ion-card-title>{{ task.name }}</ion-card-title>
          <ion-card-subtitle>
            <ion-badge :color="task.done ? 'success' : 'warning'">
              {{ task.done ? 'Completed' : 'Pending' }}
            </ion-badge>
          </ion-card-subtitle>
        </ion-card-header>
        
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>
                <h3>Task ID</h3>
                <p>{{ task.id }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-label>
                <h3>Status</h3>
                <p>{{ task.done ? 'Completed' : 'Pending' }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-label>
                <h3>Task Name</h3>
                <p>{{ task.name }}</p>
              </ion-label>
            </ion-item>
          </ion-list>

          <div v-if="task.photo" class="ion-margin-top">
            <ion-img :src="task.photo" class="task-photo" />
          </div>

          <div class="button-group ion-margin-top">
            <ion-button
              expand="block"
              color="tertiary"
              @click="handleTakePhoto"
            >
              <ion-icon slot="start" :icon="cameraIcon"></ion-icon>
              {{ task.photo ? 'Replace Photo' : 'Add Photo' }}
            </ion-button>

            <ion-button
              expand="block"
              :color="task.done ? 'warning' : 'success'"
              @click="toggleTaskStatus"
            >
              <ion-icon slot="start" :icon="task.done ? closeCircle : checkmarkCircle"></ion-icon>
              {{ task.done ? 'Mark as Pending' : 'Mark as Complete' }}
            </ion-button>

            <ion-button
              expand="block"
              color="danger"
              @click="handleDeleteTask"
            >
              <ion-icon slot="start" :icon="trash"></ion-icon>
              Delete Task
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card v-else class="ion-margin">
        <ion-card-content>
          <ion-text color="medium" class="ion-text-center">
            <p>Task not found</p>
          </ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonText,
  IonImg
} from '@ionic/vue'
import { checkmarkCircle, closeCircle, trash, camera as cameraIcon } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useTaskStore } from '@/stores/taskStore'

const route = useRoute()
const router = useRouter()
const store = useTaskStore()

// Get task by ID from route params
const task = computed(() => {
  const taskId = Number(route.params.id)
  return store.tasks.find(t => t.id === taskId)
})

// Toggle task completion status
function toggleTaskStatus() {
  if (task.value) {
    store.toggleTask(task.value.id)
  }
}

// Delete task and navigate back
function handleDeleteTask() {
  if (task.value) {
    store.removeTask(task.value.id)
    router.push('/tabs/tasks')
  }
}

async function handleTakePhoto() {
  if (!task.value) return
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    })
    if (photo.webPath) {
      store.addPhotoToTask(task.value.id, photo.webPath)
    }
  } catch (err) {
    console.warn('Photo capture cancelled or failed', err)
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

ion-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ion-badge {
  margin-top: 8px;
}

.task-photo {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 8px;
}
</style>