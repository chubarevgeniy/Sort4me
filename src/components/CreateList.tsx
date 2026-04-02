import React, { useState } from 'react';

interface CreateListProps {
  onStartSort: (title: string, items: string[]) => void;
  onCancel: () => void;
}

export const CreateList: React.FC<CreateListProps> = ({ onStartSort, onCancel }) => {
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');

  const handleStart = () => {
    const items = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (items.length < 2) {
      alert('Please enter at least 2 items to sort.');
      return;
    }

    onStartSort(title || 'My List', items);
  };

  return (
    <div className="flex flex-col gap-md">
      <div className="header">
        <h2 className="title" style={{ fontSize: '2rem' }}>New List</h2>
      </div>

      <div className="card flex flex-col gap-md">
        <div className="flex flex-col gap-sm">
          <label htmlFor="title">List Title (Optional)</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Movies to watch, Project priorities..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-sm">
          <label htmlFor="items">Items (One per line)</label>
          <textarea
            id="items"
            rows={10}
            placeholder="Item 1&#10;Item 2&#10;Item 3..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
      </div>

      <div className="actions flex justify-between">
        <button className="secondary" onClick={onCancel}>Cancel</button>
        <button onClick={handleStart}>Start Sorting</button>
      </div>
    </div>
  );
};
