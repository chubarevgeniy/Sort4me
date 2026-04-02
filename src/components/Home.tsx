import React from 'react';
import type { SortedList } from '../types';
import { clearHistory, deleteListFromHistory } from '../utils';

interface HomeProps {
  history: SortedList[];
  onNewList: () => void;
  onSelectList: (list: SortedList) => void;
  onHistoryChange: () => void;
}

export const Home: React.FC<HomeProps> = ({ history, onNewList, onSelectList, onHistoryChange }) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteListFromHistory(id);
    onHistoryChange();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      onHistoryChange();
    }
  };

  return (
    <div className="flex flex-col gap-lg">
      <div className="header">
        <h1 className="title">Sort4Me</h1>
        <p className="subtitle">Put your thoughts in order</p>
      </div>

      <button onClick={onNewList} className="flex justify-center items-center gap-sm" style={{ padding: '16px', fontSize: '1.2rem' }}>
        <span>+</span> Create New List
      </button>

      {history.length > 0 && (
        <div className="flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h3>Your Lists</h3>
            <button className="secondary" onClick={handleClearAll} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Clear All
            </button>
          </div>

          <div className="flex flex-col gap-sm">
            {history.map((list) => (
              <div key={list.id} className="history-item" onClick={() => onSelectList(list)}>
                <div className="flex flex-col">
                  <strong>{list.title || 'Untitled List'}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                    {new Date(list.createdAt).toLocaleDateString()} • {list.items.length} items
                  </span>
                </div>
                <button
                  className="icon-btn"
                  onClick={(e) => handleDelete(e, list.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
