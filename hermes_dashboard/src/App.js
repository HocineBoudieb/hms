import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Tables from './pages/Tables';
import Teams from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="flex min-h-screen bg-[#f8f8f8] min-w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
