import { useState, useEffect } from 'react';
import Layout from './Layout';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetch(`${API_BASE}/enquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEnquiries(data.enquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center py-20 text-xl">Loading Enquiries...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">All Enquiries</h1>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Customer Name</th>
              <th className="text-left p-6">Email</th>
              <th className="text-left p-6">Company</th>
              <th className="text-left p-6">Product</th>
              <th className="text-left p-6">Message</th>
              <th className="text-left p-6">Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enq => (
              <tr key={enq._id} className="border-t hover:bg-gray-50">
                <td className="p-6 font-medium">{enq.buyerName}</td>
                <td className="p-6">{enq.buyerEmail}</td>
                <td className="p-6">{enq.buyerCompany || '-'}</td>
                <td className="p-6">{enq.productId?.name || 'N/A'}</td>
                <td className="p-6 text-gray-600">{enq.message}</td>
                <td className="p-6 text-gray-500">
                  {new Date(enq.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Enquiries;