import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ products, setSearchResults }) => {
  const handleSubmit = (e) => e.preventDefault()

  const handleSearchChange = (e) => {
      if (!e.target.value && !!products) return setSearchResults(products)

      const resultsArray = products?.filter(product => product.name.toLowerCase().includes(e.target.value.toLowerCase()) || product.description.includes(e.target.value))

      setSearchResults(resultsArray)
  }

  return (

    <div className="input-group mb-4">
      <input
        type="search"
        className="form-control rounded"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="search-addon"
        onChange={handleSearchChange}
      />
      <button type="button" className="btn btn-outline-primary" onClick={handleSubmit}>
        поиск
      </button>
    </div>
  )
}

// const Filter = ({ products, setSearchResults }) => {
//   return (
//     <div className="input-group mb-4">
//       <input
//         type="search"
//         className="form-control rounded"
//         placeholder="Search"
//         aria-label="Search"
//         aria-describedby="search-addon"
//         onChange={handleSearchChange}
//       />
//       <button type="button" className="btn btn-outline-primary" onClick={handleSubmit}>
//         поиск
//       </button>
//     </div>
//   )
// }

const ListProducts = ({ data, refetch, active }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const deleteProduct = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      if(active) await axiosPrivate.delete(`/products/${id}`);
      else await axiosPrivate.post(`/products/${id}/restore`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const readProduct = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      navigate(`${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    {data?.length ? (
      <ul className="ps-0 ms-1" id="cats">
        <li>
          <Link
            to="#carpets"
            data-bs-toggle="collapse"
            className="px-0 align-middle"
          >
            <span className="d-none d-sm-inline">Ковры</span>{" "}
          </Link>
          <ul
            className="collapse show nav flex-column vl-left-dotted ms-3"
            id="carpets"
            data-bs-parent="#cats"
          >
            {data.reverse().filter((prod) => prod.category === 'carpet')?.map((product, i) => (
              <div
                key={i}
                className="info d-flex justify-content-between align-items-center ms-3 py-1 border-bottom"
              >
                <li>
                  {product?.name}
                </li>
                <div className="icons">
                  <button
                    className="btn btn-primary me-2 rounded-pill"
                    onClick={() => readProduct(product._id)}
                  >
                    Больше
                  </button>
                  <span className="ms-2">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() => deleteProduct(product._id)}
                    />
                  </span>
                  <span className="ms-2">
                    <Link to="add">
                      <FontAwesomeIcon icon={faPlus}/>
                    </Link>
                  </span>
                </div>
              </div>
            ))}
          </ul>
        </li>
        <li>
          <Link
            to="#sofas"
            data-bs-toggle="collapse"
            className="px-0 align-middle"
          >
            <span className="d-none d-sm-inline">Диваны</span>{" "}
          </Link>
          <ul
            className="collapse nav flex-column vl-left-dotted ms-3"
            id="sofas"
            data-bs-parent="#cats"
          >
            {data.reverse().filter((prod) => prod.category === 'sofa')?.map((product, i) =>
              <div
                key={i}
                className="info d-flex justify-content-between align-items-center ms-3 mb-2"
              >
                <hr />
                <li>
                  {product.name}
                </li>
                <div className="icons">
                  <button
                    className="btn btn-primary me-2 rounded-pill"
                    onClick={() => readProduct(product._id)}
                  >
                    Больше
                  </button>
                  <span className="ms-2">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() => deleteProduct(product._id)}
                    />
                  </span>
                  <span className="ms-2">
                    <Link to="add">
                      <FontAwesomeIcon icon={faPlus}/>
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </ul>
        </li>
        <li>
          <Link
            to="#chairs"
            data-bs-toggle="collapse"
            className="px-0 align-middle"
          >
            <span className="d-none d-sm-inline">Стулья</span>{" "}
          </Link>
          <ul
            className="collapse nav flex-column vl-left-dotted ms-3"
            id="chairs"
            data-bs-parent="#cats"
          >
            {data.reverse().filter((prod) => prod.category === 'chair')?.map((product, i) =>
              <div
                key={i}
                className="info d-flex justify-content-between align-items-center ms-3 mb-2"
              >
                <li>
                  {product.name}
                </li>
                <div className="icons">
                  <button
                    className="btn btn-primary me-2 rounded-pill"
                    onClick={() => readProduct(product._id)}
                  >
                    Больше
                  </button>
                  <span className="ms-2">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() => deleteProduct(product._id)}
                    />
                  </span>
                  <span className="ms-2">
                    <Link to="add">
                      <FontAwesomeIcon icon={faPlus}/>
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </ul>
        </li>
      </ul>
    ) : (
      <p>Нет товаров</p>
    )}
    </>
  )
}

const Products = ({published}) => {
  const axiosPrivate = useAxiosPrivate();
  const [searchResults, setSearchResults] = useState();
  const { data:products, error, isLoading, isError, refetch } = useQuery(
    ["products"], 
    () => axiosPrivate.get("/products").then((res) => res.data),
    {
      onSuccess: (data) => setSearchResults(data)
    }    
  );

  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... {error}</p>;

  return (
    <div className="row">
      <h1 className="text-center mb-4">{!published ? "[АРХИВ] " : ""}Список товаров</h1>
      <div className="wrapper ">
        <SearchBar products={products} setSearchResults={setSearchResults} />
        <Link to="add">
          <button className="btn btn-cp bg-cp-nephritis rounded-pill w-100">Добавить новый товар</button>
        </Link>
        {/* <Filter products={products} setSearchResults={setSearchResults}  /> */}
        <ListProducts data={searchResults.filter((prod) => prod.active === published)} refetch={refetch} active={published}/>
      </div>
    </div>
  );
};

export default Products;
