/** @format */

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import axios from 'axios';
import { format } from 'date-fns';

const DataTables = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('TOKEN');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Page size
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://api-car-rental.binaracademy.org/admin/v2/order', {
          headers: {
            access_token: `${token}`,
          },
        });

        const { orders, count } = response.data;

        // Set total records count for pagination
        setTotalRecords(count);

        // Ensuring orders is an array
        const ordersArray = Array.isArray(orders) ? orders : [orders];

        setOrders(
          ordersArray.map((item, index) => ({
            no: (page - 1) * pageSize + index + 1, // Adjusting the number to reflect the correct item number
            price: new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(item.total_price),
            startRent: format(new Date(item.start_rent_at), 'yyyy-MM-dd'),
            finishRent: format(new Date(item.finish_rent_at), 'yyyy-MM-dd'),
            userEmail: item.User?.email,
            car: item.Car?.name || 'Inova',
            category: item.Car?.category || 'Medium',
            ...item,
          }))
        );
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token, page, pageSize]);

  const handlePageChange = (event) => {
    setPage(event.page + 1); // Adjust page number for 0-based index
  };

  return (
    <PrimeReactProvider>
      <DataTable value={orders} paginator rows={pageSize} totalRecords={totalRecords} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }}>
        <Column field="no" header="No." style={{ width: '5%' }} />
        <Column field="userEmail" header="User Email" sortable />
        <Column field="car" header="Car" sortable />
        <Column field="startRent" header="Start Rent" sortable />
        <Column field="finishRent" header="Finish Rent" />
        <Column field="price" header="Price" />
        <Column field="category" header="Category" />
      </DataTable>
    </PrimeReactProvider>
  );
};

export default DataTables;
