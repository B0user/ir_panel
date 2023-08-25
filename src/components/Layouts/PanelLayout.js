import { Outlet, Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Sidebar from "../../scenes/global/Sidebar";
import { Height } from "@mui/icons-material";
import { faHouseFloodWaterCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";


const PanelLayout = ({ role }) => {
  const navigate = useNavigate();
  const [isSidebar, setIsSidebar] = useState(true);

  const sidebarStyle = {
    marginLeft: role === 1101 ? '0' : '', // Устанавливаем отступ только для роли 1101
    paddingLeft: role === 1101 ? '0' : '', // Устанавливаем отступ только для роли 1101
    backgroundColor: role === 1101 ? 'transparent' : '', // Устанавливаем фон только для роли 1101
    height: role === 1101 ? '100%' : '',
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <aside className="col-auto col-md-3 col-xl-2 bg-cp-nephritis" style={sidebarStyle}>
          <div>
            {role === 1101 && <Sidebar isSidebar = {isSidebar} />}
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