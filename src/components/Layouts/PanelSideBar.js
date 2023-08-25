import { Outlet, Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Sidebar from "../../scenes/global/Sidebar";
import { Height } from "@mui/icons-material";
import { faHouseFloodWaterCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

const PanelSideBar = ({ role }) => {
    return (
        <div className="container-fluid">
          <div className="row flex-nowrap">
            {role === 1101 && (
              <aside className="col-12 col-md-3 col-xl-2 px-0 bg-cp-nephritis" style={{ height: '100vh', position: 'fixed', top: 0, left: 0 }}>
                <Sidebar />
              </aside>
            )}
          </div>
        </div>
      );
    };

    export default PanelSideBar;