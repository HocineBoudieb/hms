import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, BarChart2, Factory, Users, Box } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Factory, label: 'Production', path: '/production' },
  { icon: BarChart2, label: 'Statistiques', path: '/statistics' },
  { icon: Box, label: 'Inventaire', path: '/inventory' },
  { icon: Users, label: 'Équipes', path: '/teams' },
  { icon: Settings, label: 'Paramètres', path: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <img
          src="./assets/logo.png"
          alt="Hermes Logo"
          className="h-12 w-12 rounded-full"
        />
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
