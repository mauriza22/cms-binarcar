/** @format */

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { format } from 'date-fns';
import { api } from '../../configs/api.config';

const DataTables = () => {
  const [orders, setOrders] = useState([]);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [orderResponse, carResponse] = await Promise.all([
          api.get('/api/v1/orders'),
          api.get('/api/v1/cars', { params: { page: 1, limit: 100 } }),
        ]);

        const ordersArray = Array.isArray(orderResponse.data) ? orderResponse.data : [];
        const cars = carResponse.data?.data || [];
        const carsById = Object.fromEntries(cars.map((car) => [car.id, car]));

        setOrders(
          ordersArray.map((item, index) => {
            const car = carsById[item.car_id];
            return {
              no: index + 1,
              price: new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(item.price),
              startRent: item.start_rent ? format(new Date(item.start_rent), 'yyyy-MM-dd') : '-',
              finishRent: item.finish_rent ? format(new Date(item.finish_rent), 'yyyy-MM-dd') : '-',
              userId: item.user_id,
              car: car ? [car.manufacture, car.model].filter(Boolean).join(' ') : 'Mobil',
              category: car?.type || '-',
              ...item,
            };
          })
        );
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <PrimeReactProvider>
      <DataTable value={orders} paginator rows={pageSize} tableStyle={{ minWidth: '50rem' }}>
        <Column field="no" header="No." style={{ width: '5%' }} />
        <Column field="userId" header="User" sortable />
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
