import React, { useState, useEffect } from 'react';
import type { SortedList, ListItem } from '../types';
import { encodeListToUrl, saveListToHistory } from '../utils';

interface ResultViewProps {
  list: SortedList;
  onHome: () => void;
  onResort: (items: string[]) => void;
  onUpdateList: (list: SortedList) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ list, onHome, onResort, onUpdateList }) => {
  const [items, setItems] = useState<ListItem[]>(list.items);

  useEffect(() => {
    setItems(list.items);
  }, [list]);

  const handleToggleCheck = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(newItems);
    updateListHistory(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
    updateListHistory(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
    updateListHistory(newItems);
  };

  const updateListHistory = (newItems: ListItem[]) => {
    const newList = { ...list, items: newItems };
    saveListToHistory(newList);
    onUpdateList(newList);
  };

  const copyAsText = () => {
    const text = items.map((item, i) => `${i + 1}. ${item.text}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const shareLink = () => {
    const plainItems = items.map(i => i.text);
    const encoded = encodeListToUrl(plainItems, list.title);
    const url = `${window.location.origin}${window.location.pathname}?list=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable link copied to clipboard!');
    });
  };

  const handleResort = () => {
    onResort(items.map(i => i.text));
  };

  return (
    <div className="flex flex-col gap-md">
      <div className="header" style={{ marginBottom: '16px' }}>
        <h2 className="title">{list.title}</h2>
        <p className="subtitle">Sorted on {new Date(list.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="actions justify-center" style={{ marginBottom: '24px' }}>
        <button className="secondary" onClick={copyAsText}>Copy Text</button>
        <button className="secondary" onClick={shareLink}>Share Link</button>
        <button className="accent" onClick={handleResort}>Resort</button>
      </div>

      <div className="card flex flex-col gap-sm">
        {items.map((item, index) => (
          <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={!!item.checked}
                onChange={() => handleToggleCheck(item.id)}
              />
              <span style={{ fontWeight: item.checked ? 'normal' : '500' }}>
                <span style={{ color: 'var(--accent-color)', marginRight: '8px' }}>{index + 1}.</span>
                {item.text}
              </span>
            </div>
            <div className="flex gap-sm">
              <button
                className="icon-btn"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                style={{ opacity: index === 0 ? 0.3 : 1 }}
              >
                ↑
              </button>
              <button
                className="icon-btn"
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
                style={{ opacity: index === items.length - 1 ? 0.3 : 1 }}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center" style={{ marginTop: '24px' }}>
        <button onClick={onHome}>Back to Menu</button>
      </div>
    </div>
  );
};
