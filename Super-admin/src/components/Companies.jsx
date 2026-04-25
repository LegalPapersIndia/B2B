import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Edit2, Plus, Trash2 } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyEmail, setNewCompanyEmail] = useState('');
  const [newCompanyPassword, setNewCompanyPassword] = useState('');
  const [newCompanyPremium, setNewCompanyPremium] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================= FETCH =================
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

  // ================= ADD =================
  const addCompany = async () => {
    if (!newCompanyName || !newCompanyEmail || !newCompanyPassword) {
      return alert("All fields required");
    }

    try {
      const res = await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          company: newCompanyName.trim(),
          email: newCompanyEmail.trim(),
          password: newCompanyPassword,
          isPremium: newCompanyPremium
        })
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.message);
      }

      alert(`Company Created!\nEmail: ${newCompanyEmail}\nPassword: ${newCompanyPassword}`);

      setNewCompanyName('');
      setNewCompanyEmail('');
      setNewCompanyPassword('');
      setNewCompanyPremium(false);
      setShowAddForm(false);

      fetchCompanies();

    } catch {
      alert("Failed to add company");
    }
  };

  // ================= EDIT =================
  const saveEdit = async (id) => {
    const updatedName = document.getElementById('companyName').value.trim();
    const isPremium = document.getElementById(`companyPremium_${id}`)?.checked === true;
    if (!updatedName) return alert("Company name required");

    try {
      await fetch(`${API_BASE}/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company: updatedName, isPremium })
      });

      alert("Updated!");
      setEditing(null);
      fetchCompanies();
    } catch {
      alert("Failed to update");
    }
  };

  // ================= DELETE =================
  const deleteCompany = async (id) => {
    const confirmDelete = window.confirm("Delete this company?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/companies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.message);
      }

      alert("Company deleted!");
      fetchCompanies();

    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return <Layout><div className="text-center py-20">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Companies ({companies.length})
        </h1>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Add Company
        </button>
      </div>

      {/* ================= ADD FORM ================= */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
          <input
            placeholder="Company Name"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={newCompanyEmail}
            onChange={(e) => setNewCompanyEmail(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={newCompanyPassword}
            onChange={(e) => setNewCompanyPassword(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={newCompanyPremium}
              onChange={(e) => setNewCompanyPremium(e.target.checked)}
            />
            Mark as Premium Seller
          </label>

          <div className="flex gap-3">
            <button
              onClick={addCompany}
              className="bg-green-600 text-white px-6 py-2 rounded-xl"
            >
              Add
            </button>

            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCompanyName('');
                setNewCompanyEmail('');
                setNewCompanyPassword('');
                setNewCompanyPremium(false);
              }}
              className="border px-6 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Premium</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-4">
                {editing?._id === c._id ? (
                  <input
                    id="companyName"
                    defaultValue={c.company}
                    className="border p-2 rounded"
                  />
                ) : (
                  c.company
                )}
              </td>

              <td>{c.email}</td>
              <td>{c.phone || '-'}</td>
              <td>
                {editing?._id === c._id ? (
                  <label className="inline-flex items-center gap-2">
                    <input
                      id={`companyPremium_${c._id}`}
                      type="checkbox"
                      defaultChecked={c.isPremium === true}
                    />
                    <span>{c.isPremium ? 'Premium' : 'Premium'}</span>
                  </label>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${c.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {c.isPremium ? 'Premium Seller' : 'Standard'}
                  </span>
                )}
              </td>

              <td className="text-center">
                {editing?._id === c._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(c._id)}
                      className="text-green-600 mr-2"
                    >
                      Save
                    </button>

                    <button onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setEditing(c)}
                      className="text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => deleteCompany(c._id)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Companies;
