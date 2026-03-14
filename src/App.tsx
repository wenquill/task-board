import { TodosProvider } from './store/context';
import { TopBar } from './components/TopBar/TopBar';
import { Board } from './components/Board/Board';
import { BulkActionBar } from './components/BulkActionBar/BulkActionBar';

function App() {
  return (
    <TodosProvider>
      <div className="app">
        <TopBar />
        <main className="main">
          <Board />
        </main>
        <BulkActionBar />
      </div>
    </TodosProvider>
  );
}

export default App;
