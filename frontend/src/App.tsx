import { HeroUIProvider } from '@heroui/react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </HeroUIProvider>
  );
}

export default App;
