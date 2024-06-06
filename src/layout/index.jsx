/** @format */

import { AppCreatePrivateRoutes } from '../configs/index.config';
import Headers from './layout.header';
import Sidebars from './layout.sidebar';

const Layout = (props) => {
  return (
    <div className="d-flex">
      <div style={{ position: 'fixed' }}>
        <Sidebars />
      </div>
      <div style={{ width: '100%', paddingLeft: '20rem' }}>
        <Headers />
        <div className="content p-5" style={{ width: '100%', backgroundColor: '#F4F5F7' }}>
          <AppCreatePrivateRoutes {...props} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
