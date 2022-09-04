// Modules
import { Routes, Route } from 'react-router-dom';
// Layouts
import Layout from './components/Layouts/Layout';
import PanelLayout from './components/Layouts/PanelLayout';
import RequireAuth from './components/Layouts/RequireAuth';
import PersistLogin from './components/Layouts/PersistLogin';
// Login
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import LoginRedir from './features/auth/LoginRedir';
import Client from './components/client/Client';
// Products CRUD
import Products from './features/products/Products';
import AddProduct from './features/products/AddProduct';
import ReadProduct from './features/products/ReadProduct';

import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<PersistLogin />}>
          <Route path="/redir" element={<LoginRedir />} />

          {/* Client Routing */} 
          <Route element={<RequireAuth allowedRoles={[1101]} />}>
            <Route path="panel" element={<PanelLayout role={1101}/>}>
              <Route index element={<Client />}/>
              <Route path="products">
                <Route index element={<Products />}/>
                <Route path="add" element={<AddProduct />}/>
                <Route path=":id" element={<ReadProduct />}/>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
