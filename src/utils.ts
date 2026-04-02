import type { SortedList } from './types';

const STORAGE_KEY = 'sort4me_history';

export const getHistory = (): SortedList[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse history', e);
    return [];
  }
};

export const saveListToHistory = (list: SortedList) => {
  const history = getHistory();
  const index = history.findIndex((h) => h.id === list.id);
  if (index !== -1) {
    history[index] = list;
  } else {
    history.unshift(list);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const deleteListFromHistory = (id: string) => {
  const history = getHistory();
  const newHistory = history.filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const encodeListToUrl = (items: string[], title: string): string => {
  const data = JSON.stringify({ items, title });
  // Base64 encoding can contain '+', which is interpreted as space in URLSearchParams.
  // We need to encode the base64 string itself so '+' becomes '%2B'.
  return encodeURIComponent(btoa(encodeURIComponent(data)));
};

export const decodeListFromUrl = (encoded: string): { items: string[]; title: string } | null => {
  try {
    // URLSearchParams automatically decoded the outer layer when using .get('list'),
    // but if it didn't (or just to be safe), we process it here.
    // Wait, if we use URLSearchParams.get(), the %2B is already converted to +.
    // So the 'encoded' string here is just the base64 string.
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to decode list from URL', e);
    return null;
  }
};
