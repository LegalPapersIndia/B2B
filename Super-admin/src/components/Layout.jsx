import { useNavigate } from 'react-router-dom';
import { Building2, Package, Tags, MessageSquare, LogOut } from 'lucide-react'; // ← Tags icon added

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white h-screen fixed flex flex-col">
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Building2 size={32} /> Super Admin
          </h2>
        </div>

        <div className="flex-1 p-6 space-y-2">
          <SidebarButton icon={Building2} label="All Companies" path="/companies" />
          <SidebarButton icon={Tags} label="All Categories" path="/categories" />     {/* ← New */}
          <SidebarButton icon={Package} label="All Products" path="/products" />
          <SidebarButton icon={MessageSquare} label="All Enquiries" path="/enquiries" />
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="ml-72 flex-1 p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
}

function SidebarButton({ icon: Icon, label, path }) {
  const navigate = useNavigate();
  const isActive = window.location.pathname === path;

  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all ${
        isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      <Icon size={22} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default Layout;