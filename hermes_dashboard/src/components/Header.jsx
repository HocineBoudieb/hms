import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useEffect,useState } from 'react';

const Header = () => {
  const [hasActiveAlerts, sethasActiveAlerts] = useState(false);
  const [recentAlert, setRecentAlert] = useState();

  useEffect(() => {
    const fetchAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/alerts/active');
            if(response){
              sethasActiveAlerts(true);
              setRecentAlert(response[0]);
            }
            else{
              sethasActiveAlerts(false);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    fetchAlerts();

    //fetch every minute
    const interval = setInterval(fetchAlerts, 60000);

    //clear Timer when component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <span className="font-medium">Hocine Boudieb</span>
          <User className="h-8 w-8 p-1 bg-gray-100 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;

