import React from 'react';
import { BarChart3, MapPin, Settings, Home, FolderOpen, Users } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'travaux', label: 'Travaux', icon: FolderOpen },
    { id: 'zones', label: 'Zones', icon: MapPin },
    { id: 'statistiques', label: 'Statistiques', icon: BarChart3 },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Suivi Travaux</h1>
        <p className="text-sm text-gray-600">Gestion des zones</p>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;