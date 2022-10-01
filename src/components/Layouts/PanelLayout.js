import { Outlet, Link, useNavigate} from "react-router-dom"

const PanelLayout = ({ role }) => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <aside className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-cp-nephritis ">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              {role === 1101 ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link align-middle px-0">
                      <i className="fs-4 bi-house" /> <span className="ms-1 d-none d-sm-inline">Главная</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/panel" className="nav-link px-0 align-middle">
                      <i className="fs-4 bi-speedometer2" /> <span className="ms-1 d-none d-sm-inline">Панель управления</span> </Link>
                  </li>
                  <li>
                    <Link to="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                      <span className="ms-1 d-none d-sm-inline">Товары</span> </Link>
                    <ul className="collapse nav flex-column ms-4" id="submenu3" data-bs-parent="#menu">
                      <li className="w-100">
                        <Link to="/panel/products" className="nav-link px-0"> <span className="d-none d-sm-inline">Посмотреть все</span></Link>
                      </li>
                      <li>
                        <Link to="/panel/products/add" className="nav-link px-0"> <span className="d-none d-sm-inline">Добавить новый</span></Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : navigate('')}
            </ul>
          </div>
        </aside>
        <article className="col py-3">
          <Outlet/>
        </article>
      </div>
    </div>
  )
}

export default PanelLayout