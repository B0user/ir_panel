import { Outlet, Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Sidebar from "../../scenes/global/Sidebar";

const PanelLayout = ({ role }) => {
  const navigate = useNavigate();

  const sidebarStyle = {
    marginLeft: role === 1101 ? '0' : '', // Устанавливаем отступ только для роли 1101
    paddingLeft: role === 1101 ? '0' : '', // Устанавливаем отступ только для роли 1101
    backgroundColor: role === 1101 ? 'transparent' : '' // Устанавливаем фон только для роли 1101
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <aside className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-cp-nephritis" style={sidebarStyle}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            {role === 1101 && <Sidebar isSidebar={true} />}
          </div>
        </aside>
        <article className={`col py-3 ${role === 1101 ? 'sidebar-expanded' : ''}`}>
          <Outlet/>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </article>
      </div>
    </div>
  );
}

export default PanelLayout;