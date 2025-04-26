import { ref, computed, type Ref } from "vue";

export function usePagination<T>(
  items: Ref<T[] | null | undefined>,
  itemsPerPageValue = 10
) {
  const itemsPerPage = ref(itemsPerPageValue);
  const currentPage = ref(1);
  const totalItems = computed(() => items.value?.length || 0);
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const paginatedItems = computed(() => {
    if (!items.value) return [];
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return items.value.slice(startIndex, endIndex);
  });

  const changePage = (page: number) => {
    currentPage.value = page;
  };

  return {
    itemsPerPage,
    currentPage,
    totalItems,
    totalPages,
    paginatedItems,
    changePage,
  };
}
