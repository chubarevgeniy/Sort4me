export interface ListItem {
  id: string;
  text: string;
  checked?: boolean;
}

export interface SortedList {
  id: string;
  title: string;
  createdAt: number;
  items: ListItem[];
}

export type ViewState = 'HOME' | 'CREATE' | 'SORT' | 'RESULT';
