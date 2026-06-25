// =============================================================
//  Task Store for Ionic TaskFlow App
//  Centralized State Management with Pinia
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

/**
 * @typedef {{ id: number, name: string, done: boolean, photo: string | null }} Task
 */

export const useTaskStore = defineStore('tasks', () => {
  // State
  /** @type {import('vue').Ref<Task[]>} */
  const tasks = ref([])
  const nextId = ref(1)

  // Getters (computed properties)
  const totalCount = computed(() => tasks.value.length)
  const doneCount = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)
  const hasDone = computed(() => tasks.value.some(t => t.done))

  // Persistence Actions
  async function saveTasks() {
    try {
      await Preferences.set({
        key: 'taskflow-tasks',
        value: JSON.stringify(tasks.value)
      })
      await Preferences.set({
        key: 'taskflow-nextId',
        value: JSON.stringify(nextId.value)
      })
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  async function loadTasks() {
    try {
      const tasksData = await Preferences.get({ key: 'taskflow-tasks' })
      const nextIdData = await Preferences.get({ key: 'taskflow-nextId' })
      
      if (tasksData.value) {
        tasks.value = JSON.parse(tasksData.value)
      }
      
      if (nextIdData.value) {
        nextId.value = JSON.parse(nextIdData.value)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  // Actions
  function addTask(name) {
    if (!name || !name.trim()) return
    tasks.value.push({
      id: nextId.value++,
      name: name.trim(),
      done: false,
      photo: null
    })
    saveTasks()
  }

  function addPhotoToTask(id, path) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.photo = path
      saveTasks()
    }
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.done = !task.done
      saveTasks()
    }
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveTasks()
  }

  function removeDoneTasks() {
    tasks.value = tasks.value.filter(t => !t.done)
    saveTasks()
  }

  // Return everything the component needs to access
  return {
    tasks,
    totalCount,
    doneCount,
    pendingCount,
    hasDone,
    addTask,
    toggleTask,
    removeTask,
    removeDoneTasks,
    addPhotoToTask,
    loadTasks
  }
})
