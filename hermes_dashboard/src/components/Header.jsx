import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useEffect,useState } from 'react';
import axios from 'axios';
import apiUrl from '../api';

/**
 * @function Header
 * @description Component to render the header of the app
 * @returns {ReactElement} A header element with a search bar, a notification
 * bell, and a user profile picture
 */
const Header = () => {
  const [hasActiveAlerts, sethasActiveAlerts] = useState(false);
  const [color, setColor] = useState("rgb(92, 199, 15)");
  const [recentAlert, setRecentAlert] = useState();

  useEffect(() => {
    const fetchAlerts = async () => {
        try {
            const response = await axios.get(apiUrl+'/alerts/active');
            if(response.data.length > 0){
              sethasActiveAlerts(true);
              setRecentAlert(response.data[0]);
              setColor("rgb(255, 111, 0)");
            }
            else{
              sethasActiveAlerts(false);
              setRecentAlert();
              setColor("rgb(92, 199, 15)");
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

  const handleClick = () => {
    if(hasActiveAlerts){
      //show the most recent alert on a little popup
      const popup = document.getElementById('alert-popup');
      popup.style.visibility = popup.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
    else{
      //hide the popup
      const popup = document.getElementById('alert-popup');
      popup.style.visibility = 'hidden';
    }

  }
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
        <button className="relative p-2 hover:bg-gray-100 rounded-full" onClick={handleClick}>
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full" style={{ backgroundColor: color }}></span>
        </button>
        <div 
        id="alert-popup" 
        className="fixed top-16 right-4 bg-white border border-gray-200 p-4 rounded-lg shadow-md" 
        style={{ width: '300px', visibility: 'hidden' }}
        >
          <h2 className="font-medium mb-2">Recent Alert</h2>
          <strong>Order id</strong><br/>
          <span>{recentAlert && recentAlert.orderId}</span><br/>
          <span>Type: {recentAlert && recentAlert.type}</span>

        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium">Hocine Boudieb</span>
          <User className="h-8 w-8 p-1 bg-gray-100 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;

