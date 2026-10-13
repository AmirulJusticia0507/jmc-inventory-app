<template>
  <MainLayout>
    <template #default>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ user.username }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ user.nama }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="user.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ user.isLocked ? 'Locked' : 'Active' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button
                    @click="toggleLock(user)"
                    :class="user.isLocked ? 'text-green-600' : 'text-yellow-600'"
                    class="text-sm font-medium hover:underline"
                    :disabled="loading"
                  >
                    {{ user.isLocked ? 'Unlock' : 'Lock' }}
                  </button>
                  <button
                    @click="openModal(user)"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="changePassword(user)"
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Password
                  </button>
                  <button
                    v-if="user.id !== authStore.user?.id"
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900 text-sm font-medium"
                    :disabled="loading"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="users.length === 0 && !loading" class="px-4 py-8 text-center text-gray-500">
            Belum ada user.
          </div>
        </div>
      </div>

    <!-- Modal for Create/Edit -->
    <div v-if="modalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ editingUser ? 'Edit' : 'Tambah' }} User</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div v-if="modalError" class="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {{ modalError }}
          </div>
          
          <div v-if="!editingUser">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input
                v-model="modalForm.username"
                type="text"
                required
                minlength="3"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password * (8-100 char, 1 uppercase, 1 lowercase, 1 number)</label>
              <input
                v-model="modalForm.password"
                type="password"
                required
                minlength="8"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
            <input
              v-model="modalForm.nama"
              type="text"
              required
              minlength="1"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="modalForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div v-if="editingUser || authStore.isAdmin">
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              v-model="modalForm.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Operator">Operator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="passwordModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ganti Password: {{ passwordUser?.nama }}</h3>
        
        <form @submit.prevent="savePassword" class="space-y-4">
          <div v-if="passwordError" class="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {{ passwordError }}
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru * (8-100 char, 1 uppercase, 1 lowercase, 1 number)</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="8"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="passwordModalOpen = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="savingPassword"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ savingPassword ? 'Menyimpan...' : 'Ganti Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hapus User?</h3>
        <p class="text-gray-600 mb-4">Yakin ingin menghapus user "{{ deleteConfirm.nama }}"?</p>
        <div class="flex justify-end space-x-3">
          <button @click="deleteConfirm = null" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button @click="executeDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Hapus
          </button>
        </div>
      </div>
    </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout.vue';

const authStore = useAuthStore();

const users = ref<Array<any>>([]);
const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingUser = ref<any>(null);
const modalForm = ref({
  username: '',
  password: '',
  nama: '',
  email: '',
  role: 'Operator' as 'Admin' | 'Operator',
});
const modalError = ref('');

const passwordModalOpen = ref(false);
const passwordUser = ref<any>(null);
const passwordForm = ref({ newPassword: '' });
const passwordError = ref('');
const savingPassword = ref(false);

const deleteConfirm = ref<{ id: string; nama: string } | null>(null);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (err) {
    console.error('Failed to fetch users:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (user: any | null) => {
  editingUser.value = user;
  modalForm.value = user
    ? { username: user.username, password: '', nama: user.nama, email: user.email, role: user.role }
    : { username: '', password: '', nama: '', email: '', role: 'Operator' };
  modalError.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  editingUser.value = null;
  modalForm.value = { username: '', password: '', nama: '', email: '', role: 'Operator' };
};

const saveUser = async () => {
  saving.value = true;
  modalError.value = '';
  try {
    if (editingUser.value) {
      await api.patch(`/users/${editingUser.value.id}`, {
        nama: modalForm.value.nama,
        email: modalForm.value.email,
        role: modalForm.value.role,
      });
    } else {
      await api.post('/users', modalForm.value);
    }
    closeModal();
    await fetchUsers();
  } catch (err: any) {
    modalError.value = err.response?.data?.message || 'Gagal menyimpan user';
  } finally {
    saving.value = false;
  }
};

const toggleLock = async (user: any) => {
  try {
    await api.patch(`/users/${user.id}/toggle-lock`);
    await fetchUsers();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal mengubah status lock');
  }
};

const changePassword = (user: any) => {
  passwordUser.value = user;
  passwordForm.value = { newPassword: '' };
  passwordError.value = '';
  passwordModalOpen.value = true;
};

const savePassword = async () => {
  savingPassword.value = true;
  passwordError.value = '';
  try {
    await api.patch(`/users/${passwordUser.value.id}/change-password`, {
      newPassword: passwordForm.value.newPassword,
    });
    passwordModalOpen.value = false;
    passwordUser.value = null;
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Gagal mengubah password';
  } finally {
    savingPassword.value = false;
  }
};

const confirmDelete = (user: any) => {
  deleteConfirm.value = { id: user.id, nama: user.nama };
};

const executeDelete = async () => {
  if (!deleteConfirm.value) return;
  try {
    await api.delete(`/users/${deleteConfirm.value.id}`);
    deleteConfirm.value = null;
    await fetchUsers();
  } catch (err: any) {
    deleteConfirm.value = null;
    alert(err.response?.data?.message || 'Gagal menghapus user');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>