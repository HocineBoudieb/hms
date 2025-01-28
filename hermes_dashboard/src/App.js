import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Tables from './pages/Tables';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Workshop from './pages/Workshop';

function App() {
  console.log("API URL:", process.env.REACT_APP_API_URL);
  return (
    <div className="flex min-h-screen bg-[#f8f8f8] min-w-full">
      <Routes>
        <Route path="/workshop/:workshopId" element={<Workshop/>} />
        <Route
          path="*"
          element={
            <div className="flex w-full">
              <Sidebar />
              <div className="flex flex-col w-full">
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

