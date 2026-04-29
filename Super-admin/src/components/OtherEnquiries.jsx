import { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/admin`
  : 'http://localhost:5000/api/admin';

function OtherEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forwardingId, setForwardingId] = useState('');
  const [selectedSellers, setSelectedSellers] = useState({});

  const token = localStorage.getItem('adminToken');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  const fetchData = async () => {
    try {
      const [enquiryRes, sellerRes] = await Promise.all([
        fetch(`${API_BASE}/other-enquiries`, { headers }),
        fetch(`${API_BASE}/users`, { headers }),
      ]);
      const enquiryData = await enquiryRes.json();
      const sellerData = await sellerRes.json();

      setEnquiries(enquiryData.enquiries || []);
      setSellers(sellerData.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const forwardEnquiry = async (enquiryId) => {
    const sellerIds = selectedSellers[enquiryId] || [];
    if (sellerIds.length === 0) {
      alert('Please select at least one seller first');
      return;
    }

    try {
      setForwardingId(enquiryId);
      const res = await fetch(`${API_BASE}/other-enquiries/${enquiryId}/forward`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ sellerIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to forward enquiry');

      setEnquiries((prev) => prev.map((enq) => (
        enq._id === enquiryId ? data.enquiry : enq
      )));
      alert('Enquiry forwarded successfully');
    } catch (err) {
      alert(err.message || 'Failed to forward enquiry');
    } finally {
      setForwardingId('');
    }
  };

  if (loading) {
    return <Layout><div className="text-center py-20 text-xl">Loading Other Enquiries...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-2">Other Enquiries</h1>
      <p className="text-gray-500 mb-8">Buy requirements from the Action Sidebar can be reviewed and forwarded to any seller.</p>

      <div className="space-y-5">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 shadow">
            No other enquiries submitted yet.
          </div>
        ) : enquiries.map((enq) => (
          <div key={enq._id} className="bg-white rounded-3xl shadow p-6">
            <div className="flex flex-col xl:flex-row gap-6 xl:items-start xl:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    OTHER REQUIREMENT
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase">
                    {enq.status || 'pending'}
                  </span>
                  {enq.assignedSellerIds && enq.assignedSellerIds.length > 0 && enq.assignedSellerIds.map((seller, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      Forwarded to {seller.company || seller.name || 'seller'}
                    </span>
                  ))}
                  {(!enq.assignedSellerIds || enq.assignedSellerIds.length === 0) && enq.assignedSellerId && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      Forwarded to {enq.assignedSellerId.company || enq.sellerCompany || 'seller'}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{enq.productName || 'Buy Requirement'}</h2>
                <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
                  <Info label="Category" value={enq.category} />
                  <Info label="Subcategory" value={enq.subcategory} />
                  <Info label="Quantity" value={enq.quantity} />
                  <Info label="Buyer" value={enq.buyerName} />
                  <Info label="Email" value={enq.buyerEmail} />
                  <Info label="Phone" value={enq.buyerPhone} />
                  <Info label="Submitted" value={new Date(enq.createdAt).toLocaleString()} />
                  <Info label="Forwarded" value={enq.forwardedAt ? new Date(enq.forwardedAt).toLocaleString() : '-'} />
                </div>

                {enq.message && (
                  <div className="mt-5 p-4 rounded-2xl bg-gray-50 border text-gray-700">
                    {enq.message}
                  </div>
                )}
              </div>

              <div className="w-full xl:w-80 bg-gray-50 rounded-2xl p-4 border">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Forward to sellers (hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  size="8"
                  value={selectedSellers[enq._id] || []}
                  onChange={(event) => {
                    const options = Array.from(event.target.selectedOptions, option => option.value);
                    setSelectedSellers((prev) => ({ ...prev, [enq._id]: options }));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select seller</option>
                  {sellers.map((seller) => (
                    <option key={seller._id || seller.id} value={seller._id || seller.id}>
                      {seller.company || seller.name || seller.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => forwardEnquiry(enq._id)}
                  disabled={forwardingId === enq._id}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
                >
                  {forwardingId === enq._id ? 'Forwarding...' : 'Forward Enquiry'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{value || '-'}</p>
    </div>
  );
}

export default OtherEnquiries;
