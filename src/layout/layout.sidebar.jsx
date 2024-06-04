/** @format */

import { useNavigate } from 'react-router';
import { useState } from 'react';

const Sidebars = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === 'dashboard') {
      navigate('/dashboard');
    } else if (menu === 'car') {
      navigate('/car');
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh', width: '290px', position: 'sticky' }}>
      <div className="d-flex gap-3 flex-column" style={{ backgroundColor: '#0D28A6', width: 70, position: 'sticky', top: 0, height: '100vh' }}>
        <div className="p-3">
          <div style={{ width: 34, height: 34, backgroundColor: '#CFD4ED' }} />
        </div>
        <ul className="d-flex flex-column justify-content-center text-center" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li onClick={() => handleMenuClick('dashboard')} className="d-flex flex-column align-items-center" style={{ height: 64, cursor: 'pointer' }}>
            <i className="fa fa-home d-flex align-items-center" style={{ color: 'white', flex: 1 }}></i>
            <p style={{ color: 'white', fontSize: 12, margin: 0, flex: 1 }}>Dashboard</p>
          </li>
          <li onClick={() => handleMenuClick('car')} className="d-flex cursor-pointer flex-column align-items-center" style={{ height: 64, cursor: 'pointer' }}>
            <i className="fa fa-car d-flex align-items-center" style={{ color: 'white', flex: 1 }}></i>
            <p style={{ color: 'white', fontSize: 12, margin: 0, flex: 1 }}>Cars</p>
          </li>
        </ul>
      </div>
      <div className="d-flex gap-3 flex-column expand-sidebar" style={{ flex: 1 }}>
        <div className="d-flex align-items-center justify-content-center" style={{ height: 70, width: '100%' }}>
          <h4>Binar CMS</h4>
        </div>
        {activeMenu === 'dashboard' && (
          <div>
            <div style={{ width: '100%', height: 45 }} className="d-flex ms-4 align-items-center ">
              <span style={{ flex: 1, color: 'gray', fontSize: 16, fontWeight: '500' }}>DASHBOARD</span>
            </div>
            <div style={{ width: '100%', height: 45 }} className="d-flex ms-4 align-items-center ">
              <span style={{ flex: 1, fontSize: 14, fontWeight: '400' }}>Dashboard</span>
            </div>
          </div>
        )}
        {activeMenu === 'car' && (
          <div>
            <div style={{ width: '100%', height: 45 }} className="d-flex ms-4 align-items-center ">
              <span style={{ flex: 1, color: 'gray', fontSize: 16, fontWeight: '500' }}>CARS</span>
            </div>
            <div style={{ width: '100%', height: 45 }} className="d-flex ms-4 align-items-center ">
              <span onClick={() => navigate('/car')} style={{ flex: 1, fontSize: 14, fontWeight: '400', cursor: 'pointer' }}>
                List Car
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebars;
