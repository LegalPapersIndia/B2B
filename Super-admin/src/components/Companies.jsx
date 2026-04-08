import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Edit2, Plus } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async () => {
    if (!newCompanyName.trim()) return alert("Company name cannot be empty");

    try {
      await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company: newCompanyName.trim() })
      });

      alert("Company Added Successfully!");
      setNewCompanyName('');
      setShowAddForm(false);
      fetchCompanies();
    } catch (err) {
      alert("Failed to add company");
    }
  };

  const saveEdit = async (id) => {
    const updatedName = document.getElementById('companyName').value.trim();
    if (!updatedName) return alert("Company name cannot be empty");

    try {
      await fetch(`${API_BASE}/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company: updatedName })
      });

      alert("Company Updated!");
      setEditing(null);
      fetchCompanies();
    } catch (err) {
      alert("Failed to update");
    }
  };

  if (loading) {
    return <Layout><div className="text-center py-20 text-xl">Loading Companies...</div></Layout>;
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">All Companies (Sellers)</h1>
          <p className="text-gray-500">Total: {companies.length}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium"
        >
          <Plus size={20} /> Add Company
        </button>
      </div>

      {/* Add Company Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 mb-8 shadow">
          <h3 className="font-semibold mb-3">Add New Company</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              className="flex-1 border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
            />
            <button onClick={addCompany} className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-2xl">Add</button>
            <button onClick={() => {setShowAddForm(false); setNewCompanyName('');}} className="border px-6 rounded-2xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Company Name</th>
              <th className="text-left p-6">Seller Name</th>
              <th className="text-left p-6">Email</th>
              <th className="text-left p-6">Phone</th>
              <th className="w-32 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-6 font-semibold text-lg">
                  {editing?._id === c._id ? (
                    <input
                      id="companyName"
                      defaultValue={c.company || ""}
                      className="w-full border rounded-xl px-4 py-2"
                    />
                  ) : (
                    c.company || "Not Provided"
                  )}
                </td>
                <td className="p-6 text-gray-600">{c.name || '-'}</td>
                <td className="p-6">{c.email}</td>
                <td className="p-6">{c.phone || '-'}</td>
                <td className="p-6 text-center">
                  {editing?._id === c._id ? (
                    <>
                      <button onClick={() => saveEdit(c._id)} className="text-green-600 mr-3">Save</button>
                      <button onClick={() => setEditing(null)} className="text-gray-500">Cancel</button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditing(c)} 
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-xl transition"
                    >
                      <Edit2 size={22} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Companies;