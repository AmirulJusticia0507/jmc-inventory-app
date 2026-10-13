<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0"
      :class="{ '-translate-x-full': !sidebarOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 class="text-xl font-bold text-indigo-600">
            JMC Inventory
          </h1>
          <button
            class="lg:hidden text-gray-500 hover:text-gray-700"
            @click="toggleSidebar"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <router-link
            to="/incoming-goods"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isActive('/incoming-goods') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Barang Masuk
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/categories"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isActive('/categories') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Master Kategori
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/sub-categories"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isActive('/sub-categories') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Master Sub Kategori
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/users"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isActive('/users') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Manajemen User
          </router-link>
        </nav>

        <!-- User Info & Logout -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center mb-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-medium">{{ authStore.user?.nama?.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ authStore.user?.nama }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ authStore.user?.role }}
              </p>
            </div>
          </div>
          <button
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            @click="logout"
          >
            <svg
              class="w-5 h-5 inline mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Keluar
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 min-h-screen">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Close sidebar on route change (mobile)
router.beforeEach(() => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
});
</script>