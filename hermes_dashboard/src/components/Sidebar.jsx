import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard , Settings, Siren, Table, ChartColumnIncreasing  } from 'lucide-react';
import ImageFile from '../assets/logo.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/' },
  {icon: ChartColumnIncreasing, label: 'Metriques', path: '/metrics'},
  { icon: Table , label: 'Toutes les tables', path: '/tables' },
  { icon: Siren, label: 'Alertes', path: '/alerts' },
  { icon: Settings, label: 'Parametres', path: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-center gap-3 mb-8">
        <img src={ImageFile} alt="Logo" className='w-1/2' />
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
