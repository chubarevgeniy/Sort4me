import React, { useState, useEffect, useRef } from 'react';

interface SortEngineProps {
  items: string[];
  onFinish: (sortedItems: string[]) => void;
  onCancel: () => void;
}

export const SortEngine: React.FC<SortEngineProps> = ({ items, onFinish, onCancel }) => {
  const [currentPair, setCurrentPair] = useState<[string, string] | null>(null);
  const [progress, setProgress] = useState(0);

  // Use refs for the state machine to avoid re-triggering the sort loop
  const resolvePromiseRef = useRef<((value: number) => void) | null>(null);
  const isSortingRef = useRef(false);

  const compare = (a: string, b: string): Promise<number> => {
    return new Promise((resolve) => {
      setCurrentPair([a, b]);
      resolvePromiseRef.current = resolve;
    });
  };

  const handleChoice = (choice: number) => {
    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(choice);
      resolvePromiseRef.current = null;
    }
  };

  const merge = async (left: string[], right: string[]): Promise<string[]> => {
    const result: string[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      const choice = await compare(left[i], right[j]);
      // If choice < 0, left is preferred. If > 0, right is preferred.
      // We want to sort descending by preference (most preferred first).
      // Let's define: choice === -1 means left is better. choice === 1 means right is better.
      // So if left is better, it goes first.
      if (choice < 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
      // Very rough progress estimation
      setProgress((p) => Math.min(p + 1, 95));
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  };

  const mergeSort = async (array: string[]): Promise<string[]> => {
    if (array.length <= 1) {
      return array;
    }

    const mid = Math.floor(array.length / 2);
    const left = await mergeSort(array.slice(0, mid));
    const right = await mergeSort(array.slice(mid));

    return await merge(left, right);
  };

  useEffect(() => {
    if (!isSortingRef.current) {
      isSortingRef.current = true;
      mergeSort([...items]).then((sorted) => {
        setProgress(100);
        onFinish(sorted);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-lg" style={{ minHeight: '60vh' }}>
      <div className="header">
        <h2 className="title" style={{ fontSize: '2rem' }}>Which is more important?</h2>
        <p className="subtitle">Click on your preferred option</p>
      </div>

      {currentPair ? (
        <div className="sort-container">
          <div className="sort-card" onClick={() => handleChoice(-1)}>
            {currentPair[0]}
          </div>
          <div className="flex justify-center items-center" style={{ color: 'var(--accent-color)' }}>
            <span style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>OR</span>
          </div>
          <div className="sort-card" onClick={() => handleChoice(1)}>
            {currentPair[1]}
          </div>
        </div>
      ) : (
        <div>Sorting...</div>
      )}

      <div style={{ width: '100%', marginTop: '32px' }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '8px', textAlign: 'center', color: 'var(--accent-color)' }}>
          Sorting in progress... {progress}% (estimate)
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--secondary-color)', borderRadius: '4px' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <div className="actions" style={{ marginTop: '48px' }}>
        <button className="secondary" onClick={onCancel}>Cancel Sorting</button>
      </div>
    </div>
  );
};
