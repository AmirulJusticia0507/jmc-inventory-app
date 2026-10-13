import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import type { IncomingGood, IncomingGoodItem, IncomingGoodQuery, PaginatedResponse } from '@/types';

type IncomingGoodCreateData = {
  transactionDate: string;
  categoryId: string;
  subCategoryId: string;
  source: string;
  letterNumber?: string;
  attachmentPath?: string;
  items: Omit<IncomingGoodItem, 'id' | 'incomingGoodId' | 'createdAt' | 'updatedAt'>[];
};

export const useIncomingGoodsStore = defineStore('incomingGoods', () => {
  const items = ref<IncomingGood[]>([]);
  const currentItem = ref<IncomingGood | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const query = ref<IncomingGoodQuery>({
    page: 1,
    limit: 10,
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  });

  const categories = ref<import('@/types').Category[]>([]);
  const subCategories = ref<import('@/types').SubCategory[]>([]);

  async function fetchCategories() {
    const response = await api.get('/categories');
    categories.value = response.data;
  }

  async function fetchSubCategories() {
    const response = await api.get('/sub-categories');
    subCategories.value = response.data;
  }

  async function fetchList(params?: Partial<IncomingGoodQuery>) {
    loading.value = true;
    error.value = null;
    try {
      if (params) {
        query.value = { ...query.value, ...params };
      }
      const response = await api.get<PaginatedResponse<IncomingGood>>('/incoming-goods', {
        params: query.value,
      });
      items.value = response.data.data;
      pagination.value = response.data.meta;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch incoming goods';
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<IncomingGood>(`/incoming-goods/${id}`);
      currentItem.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch incoming good';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: {
    transactionDate: string;
    categoryId: string;
    subCategoryId: string;
    source: string;
    letterNumber?: string;
    attachmentPath?: string;
    items: Omit<IncomingGoodItem, 'id' | 'incomingGoodId' | 'createdAt' | 'updatedAt'>[];
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<IncomingGood>('/incoming-goods', data);
      await fetchList();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create incoming good';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: Partial<IncomingGoodCreateData>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch<IncomingGood>(`/incoming-goods/${id}`, data);
      await fetchList();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update incoming good';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function toggleVerified(id: string, isVerified: boolean) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch<IncomingGood>(`/incoming-goods/${id}/verify`, { isVerified });
      await fetchList();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle verification';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/incoming-goods/${id}`);
      await fetchList();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete incoming good';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function exportExcel(params?: Partial<IncomingGoodQuery>) {
    const response = await api.get('/incoming-goods/export', {
      params: { ...query.value, ...params },
      responseType: 'blob',
    });
    return response.data;
  }

  function setQuery(newQuery: Partial<IncomingGoodQuery>) {
    query.value = { ...query.value, ...newQuery };
  }

  function resetQuery() {
    query.value = {
      page: 1,
      limit: 10,
      sortBy: 'transactionDate',
      sortOrder: 'desc',
    };
  }

  return {
    items,
    currentItem,
    loading,
    error,
    pagination,
    query,
    categories,
    subCategories,
    fetchCategories,
    fetchSubCategories,
    fetchList,
    fetchOne,
    create,
    update,
    toggleVerified,
    remove,
    exportExcel,
    setQuery,
    resetQuery,
  };
});