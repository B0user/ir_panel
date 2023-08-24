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
import Client from './components/profiles/Client';
// Products CRUD
import Products from './features/products/Products';
import AddProduct from './features/products/AddProduct';
import ReadProduct from './features/products/ReadProduct';
// Client Chat Support
import ClientChat from './features/chat/ClientChat';
import ClientChatMessages from './features/chat/ClientChatMessages';
// Messages
import Messages from './features/support/Messages';
import ReadMessage from './features/support/ReadMessage';

import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import ShowProducts from './features/products/ShowProducts';
import { useState } from 'react';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <main className="content">
            
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
                    {/* <Route index element={<Products published={true}/>}/> */}
                    {/*<Route path="archieve" element={<Products published={false}/>}/>
                    <Route path="add" element={<AddProduct />}/>
                    <Route path=":id" element={<ReadProduct />}/> */}
                  <Route index element={<ShowProducts />}/>
                    <Route path = "add" element = {<AddProduct />}/>
                  </Route>
                  <Route path="support">
                    <Route index element={<ClientChat />}/>
                    <Route path=":id" element={<ClientChatMessages />}/>
                  </Route>
                </Route>
              </Route>

              {/* Support Routing */} 
              <Route element={<RequireAuth allowedRoles={[2837]} />}>
                <Route path="support" element={<PanelLayout role={2837}/>}>
                  <Route index element={<Messages isClosed={false} isPublic={false}/>}/>
                  <Route path="publicreports" element={<Messages isClosed={false} isPublic={true}/>}/>
                  <Route path="completed" element={<Messages isClosed={true} isPublic={true}/>}/>
                  <Route path=":id" element={<ReadMessage />}/>
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
        </main>
        </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
