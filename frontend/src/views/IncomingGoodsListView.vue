<template>
  <MainLayout>
    <template #default>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              v-model="filters.categoryId"
              @change="handleSearch"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Kategori</option>
              <option v-for="cat in incomingStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.code }} - {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sub Kategori</label>
            <select
              v-model="filters.subCategoryId"
              @change="handleSearch"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Sub Kategori</option>
              <option v-for="sub in filteredSubCategories" :key="sub.id" :value="sub.id">
                {{ sub.name }} (Rp {{ formatNumber(sub.priceLimit) }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <select
              v-model="filters.year"
              @change="handleSearch"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Tahun</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari (Asal/Sub Kat)</label>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Cari..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div class="flex items-end">
            <button
              type="button"
              @click="exportExcel"
              :disabled="incomingStore.loading"
              class="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Export Excel
            </button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori / Sub</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Surat</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Verifikasi</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in incomingStore.items" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(item.transactionDate) }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.operator?.nama }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ item.category?.code }} / {{ item.subCategory?.name }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.source }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.letterNumber || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-right">Rp {{ formatNumber(item.grandTotal) }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="toggleVerified(item)"
                    :class="item.isVerified ? 'text-green-600' : 'text-gray-400'"
                    class="p-1 rounded hover:bg-gray-100 transition-colors"
                    :disabled="incomingStore.loading"
                    title="Toggle Verifikasi"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
                <td class="px-4 py-3 text-center space-x-2">
                  <router-link
                    :to="`/incoming-goods/${item.id}/print`"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    target="_blank"
                  >
                    Cetak
                  </router-link>
                  <router-link
                    :to="`/incoming-goods/${item.id}/edit`"
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(item)"
                    class="text-red-600 hover:text-red-900 text-sm font-medium"
                    :disabled="incomingStore.loading"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="incomingStore.pagination.totalPages > 1" class="px-4 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Menampilkan {{ (incomingStore.pagination.page - 1) * incomingStore.pagination.limit + 1 }} sampai
              {{ Math.min(incomingStore.pagination.page * incomingStore.pagination.limit, incomingStore.pagination.total) }}
              dari {{ incomingStore.pagination.total }} data
            </div>
            <div class="flex space-x-2">
              <button
                @click="goToPage(incomingStore.pagination.page - 1)"
                :disabled="incomingStore.pagination.page === 1 || incomingStore.loading"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                @click="goToPage(incomingStore.pagination.page + 1)"
                :disabled="incomingStore.pagination.page === incomingStore.pagination.totalPages || incomingStore.loading"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        <div v-if="incomingStore.items.length === 0 && !incomingStore.loading" class="px-4 py-8 text-center text-gray-500">
          Tidak ada data barang masuk
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hapus Data?</h3>
        <p class="text-gray-600 mb-4">Yakin ingin menghapus data barang masuk dari {{ deleteConfirm.source }}?</p>
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
import { ref, computed, onMounted } from 'vue';
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import MainLayout from '@/components/layout/MainLayout.vue';

const incomingStore = useIncomingGoodsStore();

const filters = ref({
  categoryId: '',
  subCategoryId: '',
  year: undefined as number | undefined,
  search: '',
});

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
});

const filteredSubCategories = computed(() => {
  if (!filters.value.categoryId) return incomingStore.subCategories;
  return incomingStore.subCategories.filter(s => s.categoryId === filters.value.categoryId);
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const deleteConfirm = ref<{ id: string; source: string } | null>(null);

const handleSearch = () => {
  incomingStore.setQuery({ ...filters.value, page: 1, year: filters.value.year ? Number(filters.value.year) : undefined });
  incomingStore.fetchList();
};

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    incomingStore.setQuery({ ...filters.value, page: 1, year: filters.value.year ? Number(filters.value.year) : undefined });
    incomingStore.fetchList();
  }, 300);
};

const goToPage = (page: number) => {
  incomingStore.setQuery({ page });
  incomingStore.fetchList();
};

const toggleVerified = async (item: any) => {
  try {
    await incomingStore.toggleVerified(item.id, !item.isVerified);
  } catch (err) {
    // Error handled in store
  }
};

const confirmDelete = (item: any) => {
  deleteConfirm.value = { id: item.id, source: item.source };
};

// Used in template
const executeDelete = async () => {
  if (!deleteConfirm.value) return;
  try {
    await incomingStore.remove(deleteConfirm.value.id);
    deleteConfirm.value = null;
  } catch (err) {
    deleteConfirm.value = null;
  }
};

const exportExcel = async () => {
  try {
    const blob = await incomingStore.exportExcel();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `barang-masuk-${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Export failed:', err);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

onMounted(async () => {
  await Promise.all([
    incomingStore.fetchCategories(),
    incomingStore.fetchSubCategories(),
  ]);
  incomingStore.fetchList();
});
</script>