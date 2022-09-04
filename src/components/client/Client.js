import { Link } from "react-router-dom";

const Client = () => {
  return ( 
    <>
      <h1>Панель управления</h1>
      <br />
      <Link to="products">Товары</Link>
      <br />
      <div className="flexGrow">
        <Link to="/">Главная</Link>
      </div>
    </>
  )
}

export default Client