import { useState, useEffect } from 'react';
import type { ViewState, SortedList } from './types';
import { getHistory, saveListToHistory, decodeListFromUrl } from './utils';
import { Home } from './components/Home';
import { CreateList } from './components/CreateList';
import { SortEngine } from './components/SortEngine';
import { ResultView } from './components/ResultView';
import './index.css';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [history, setHistory] = useState<SortedList[]>([]);

  // Sorting state
  const [currentTitle, setCurrentTitle] = useState('');
  const [itemsToSort, setItemsToSort] = useState<string[]>([]);

  // Result state
  const [currentList, setCurrentList] = useState<SortedList | null>(null);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    const checkUrlForSharedList = () => {
      const params = new URLSearchParams(window.location.search);
      const encodedList = params.get('list');

      if (encodedList) {
        const decoded = decodeListFromUrl(encodedList);
        if (decoded && decoded.items.length > 0) {
          // Instead of forcing them to sort, generate a new SortedList object
          // and show them the RESULT view directly.
          const newList: SortedList = {
            id: Date.now().toString(),
            title: decoded.title || 'Shared List',
            createdAt: Date.now(),
            items: decoded.items.map((text, i) => ({
              id: `${Date.now()}-${i}`,
              text,
              checked: false
            }))
          };

          saveListToHistory(newList);
          setCurrentList(newList);
          setView('RESULT');

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    loadHistory();
    checkUrlForSharedList();
  }, []);

  const handleStartSort = (title: string, items: string[]) => {
    setCurrentTitle(title);
    setItemsToSort(items);
    setView('SORT');
  };

  const handleFinishSort = (sortedItems: string[]) => {
    const newList: SortedList = {
      id: Date.now().toString(),
      title: currentTitle,
      createdAt: Date.now(),
      items: sortedItems.map((text, i) => ({
        id: `${Date.now()}-${i}`,
        text,
        checked: false
      }))
    };

    saveListToHistory(newList);
    setCurrentList(newList);
    loadHistory();
    setView('RESULT');
  };

  const handleUpdateList = (updatedList: SortedList) => {
    setCurrentList(updatedList);
    loadHistory();
  };

  return (
    <>
      {view === 'HOME' && (
        <Home
          history={history}
          onNewList={() => setView('CREATE')}
          onSelectList={(list) => {
            setCurrentList(list);
            setView('RESULT');
          }}
          onHistoryChange={loadHistory}
        />
      )}

      {view === 'CREATE' && (
        <CreateList
          onStartSort={handleStartSort}
          onCancel={() => setView('HOME')}
        />
      )}

      {view === 'SORT' && (
        <SortEngine
          items={itemsToSort}
          onFinish={handleFinishSort}
          onCancel={() => setView('HOME')}
        />
      )}

      {view === 'RESULT' && currentList && (
        <ResultView
          list={currentList}
          onHome={() => setView('HOME')}
          onResort={(items) => handleStartSort(currentList.title, items)}
          onUpdateList={handleUpdateList}
        />
      )}
    </>
  );
}

export default App;
