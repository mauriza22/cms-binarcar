/** @format */
import BarChart from '../../components/dashboard/barchart';
import DataTables from '../../components/dashboard/datatable';

const Dashboard = () => {
  return (
    <div className="d-flex gap-5 flex-column">
      <nav
        className=""
        style={{ '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E\")" }}
        aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item first-list">Dashboard</li>
          <li className="breadcrumb-item" aria-current="page">
            Dashboard
          </li>
        </ol>
      </nav>

      <div>
        <div className="border-start border-5 border-primary">
          <span className="callout fw-bolder">Rented Car Visualization</span>
        </div>
        <span>Month</span>
      </div>
      <BarChart />

      <div className="pt-5">
        <h5 className="fw-bolder pb-3">Dashboard</h5>
        <div className="border-start border-5 border-primary">
          <span className="callout fw-bolder">List Car</span>
        </div>
        Tabel
      </div>
      <DataTables />
    </div>
  );
};

export default Dashboard;
