<template>
  <MainLayout>
    <template #default>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {{ error }}
        </div>

        <!-- Header Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informasi Transaksi</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi *</label>
              <input
                v-model="form.transactionDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                v-model="form.categoryId"
                @change="onCategoryChange"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Pilih Kategori</option>
                <option v-for="cat in incomingStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.code }} - {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sub Kategori *</label>
              <select
                v-model="form.subCategoryId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Pilih Sub Kategori</option>
                <option v-for="sub in filteredSubCategories" :key="sub.id" :value="sub.id">
                  {{ sub.name }} (Batas: Rp {{ formatNumber(sub.priceLimit) }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Asal Barang *</label>
              <input
                v-model="form.source"
                type="text"
                required
                maxlength="200"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Surat</label>
              <input
                v-model="form.letterNumber"
                type="text"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lampiran (PDF, Image, Doc, Excel)</label>
              <input
                ref="fileInput"
                @change="onFileChange"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p v-if="form.attachmentName" class="mt-1 text-sm text-green-600">
                File dipilih: {{ form.attachmentName }}
              </p>
            </div>
            
            <!-- Operator field - readonly for Operator role -->
            <div v-if="authStore.isAdmin">
              <label class="block text-sm font-medium text-gray-700 mb-1">Operator</label>
              <select
                v-model="form.operatorId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.nama }} ({{ user.username }})
                </option>
              </select>
            </div>
            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-1">Operator</label>
              <input
                :value="authStore.user?.nama || ''"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              />
              <p class="mt-1 text-xs text-gray-500">Otomatis terisi sesuai akun login</p>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Item Barang</h2>
            <button
              type="button"
              @click="addItem"
              class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              + Tambah Item
            </button>
          </div>

          <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
            Belum ada item. Klik "Tambah Item" untuk menambah.
          </div>

          <div class="space-y-4" v-for="(item, index) in form.items" :key="index">
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="flex justify-between items-start mb-3">
                <span class="font-medium text-gray-900">Item #{{ index + 1 }}</span>
                <button
                  type="button"
                  @click="removeItem(index)"
                  :disabled="form.items.length === 1"
                  class="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Kode Item *</label>
                  <input
                    v-model="item.itemCode"
                    type="text"
                    required
                    maxlength="50"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div class="lg:col-span-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Nama Item *</label>
                  <input
                    v-model="item.itemName"
                    type="text"
                    required
                    maxlength="200"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Harga *</label>
                  <input
                    v-model.number="item.price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    @input="calculateTotals"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Qty *</label>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    required
                    min="1"
                    @input="calculateTotals"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Satuan *</label>
                  <input
                    v-model="item.unit"
                    type="text"
                    required
                    maxlength="40"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal Kadaluarsa</label>
                  <input
                    v-model="item.expiredDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div class="flex items-end">
                  <div class="w-full">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Total</label>
                    <input
                      :value="formatNumber(item.price * item.quantity)"
                      type="text"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 font-medium text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grand Total & Validation -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-600">Grand Total</p>
                <p class="text-2xl font-bold text-gray-900">Rp {{ formatNumber(grandTotal) }}</p>
              </div>
              <div v-if="selectedSubCategory" class="text-right">
                <p class="text-sm text-gray-600">Batas Harga Sub Kategori</p>
                <p class="text-xl font-bold" :class="grandTotal > selectedSubCategory.priceLimit ? 'text-red-600' : 'text-green-600'">
                  Rp {{ formatNumber(selectedSubCategory.priceLimit) }}
                </p>
              </div>
            </div>
            <div v-if="grandTotal > (selectedSubCategory?.priceLimit || 0)" class="mt-2 text-red-600 text-sm">
              ⚠ Total melebihi batas harga sub kategori! Data tidak bisa disimpan.
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <router-link
            to="/incoming-goods"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="submitting || grandTotal > (selectedSubCategory?.priceLimit || 0)"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ submitting ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan') }}
          </button>
        </div>
      </form>
    </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const incomingStore = useIncomingGoodsStore();
const authStore = useAuthStore();

const isEdit = computed(() => !!route.params.id);
const submitting = ref(false);
const error = ref('');

const form = ref({
  transactionDate: new Date().toISOString().split('T')[0],
  categoryId: '',
  subCategoryId: '',
  source: '',
  letterNumber: '',
  operatorId: '',
  attachment: null as File | null,
  attachmentName: '',
  items: [] as Array<{
    itemCode: string;
    itemName: string;
    price: number;
    quantity: number;
    unit: string;
    expiredDate: string;
  }>,
});

const users = ref<Array<{ id: string; nama: string; username: string }>>([]);

const selectedSubCategory = computed(() => {
  return incomingStore.subCategories.find(s => s.id === form.value.subCategoryId);
});

const filteredSubCategories = computed(() => {
  if (!form.value.categoryId) return incomingStore.subCategories;
  return incomingStore.subCategories.filter(s => s.categoryId === form.value.categoryId);
});

const grandTotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const addItem = () => {
  form.value.items.push({
    itemCode: '',
    itemName: '',
    price: 0,
    quantity: 1,
    unit: '',
    expiredDate: '',
  });
};

const removeItem = (index: number) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1);
  }
};

const calculateTotals = () => {
  // Trigger reactivity
  form.value.items = [...form.value.items];
};

const onCategoryChange = () => {
  form.value.subCategoryId = '';
  form.value.items = [];
  addItem();
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    form.value.attachment = input.files[0];
    form.value.attachmentName = input.files[0].name;
  }
};

const handleSubmit = async () => {
  if (grandTotal.value > (selectedSubCategory.value?.priceLimit || 0)) {
    error.value = 'Grand total melebihi batas harga sub kategori';
    return;
  }

  if (form.value.items.some(i => !i.itemCode || !i.itemName || !i.unit || i.price <= 0 || i.quantity <= 0)) {
    error.value = 'Semua field item wajib diisi dengan benar';
    return;
  }

  submitting.value = true;
  error.value = '';

  try {
    // Upload file first if attachment exists
    let attachmentPath = undefined;
    if (form.value.attachment) {
      const formData = new FormData();
      formData.append('file', form.value.attachment);
      const uploadResponse = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      attachmentPath = uploadResponse.data.filename; // Store filename only
    }

    const payload = {
      transactionDate: form.value.transactionDate,
      categoryId: form.value.categoryId,
      subCategoryId: form.value.subCategoryId,
      source: form.value.source,
      letterNumber: form.value.letterNumber || undefined,
      attachmentPath,
      operatorId: authStore.isAdmin ? form.value.operatorId : undefined,
      items: form.value.items.map(item => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        totalPrice: item.price * item.quantity,
        expiredDate: item.expiredDate || null,
      })),
    };

    if (isEdit.value) {
      await incomingStore.update(route.params.id as string, payload);
    } else {
      await incomingStore.create(payload);
    }
    
    router.push('/incoming-goods');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal menyimpan data';
  } finally {
    submitting.value = false;
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

const loadUsers = async () => {
  if (authStore.isAdmin) {
    try {
      const response = await api.get('/users');
      users.value = response.data.map((u: any) => ({
        id: u.id,
        nama: u.nama,
        username: u.username,
      }));
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }
};

onMounted(async () => {
  await Promise.all([
    incomingStore.fetchCategories(),
    incomingStore.fetchSubCategories(),
    loadUsers(),
  ]);

  if (isEdit.value) {
    try {
      const data = await incomingStore.fetchOne(route.params.id as string);
      form.value = {
        transactionDate: data.transactionDate.split('T')[0],
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        source: data.source,
        letterNumber: data.letterNumber || '',
        operatorId: data.operatorId,
        attachment: null,
        attachmentName: data.attachmentPath ? data.attachmentPath.split('/').pop() || '' : '',
        items: data.items?.map(item => ({
          itemCode: item.itemCode,
          itemName: item.itemName,
          price: Number(item.price),
          quantity: item.quantity,
          unit: item.unit,
          expiredDate: item.expiredDate ? item.expiredDate.split('T')[0] : '',
        })) || [],
      };
    } catch (err) {
      router.push('/incoming-goods');
    }
  } else {
    addItem();
  }
});

watch(() => form.value.categoryId, () => {
  form.value.subCategoryId = '';
  form.value.items = [];
  addItem();
});
</script>