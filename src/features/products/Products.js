import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const Products = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error, isLoading, isError, refetch } = useQuery(["products"], () =>
    axiosPrivate.get("/products").then((res) => res.data)
  );

  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... {error}</p>;

  const deleteProduct = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      await axiosPrivate.delete(`/products/${id}`);
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
    <div className="row">
      <h1 className="text-center mb-4">Список товаров</h1>
      <div className="wrapper ">
        {/* <div className="input-group mb-4">
          <input
            type="search"
            className="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <button type="button" className="btn btn-outline-primary">
            поиск
          </button>
        </div> */}
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
                {data.filter((prod) => prod.category === 'carpet').map((product, i) => (
                  <div
                    key={i}
                    className="info d-flex justify-content-between align-items-center ms-3 mb-2"
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
                {data.filter((prod) => prod.category === 'sofa').map((product, i) =>
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
                {data.filter((prod) => prod.category === 'chair').map((product, i) =>
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
        <Link to="add">
          <button className="btn btn-cp bg-cp-nephritis rounded-pill w-100">Добавить новый товар</button>
        </Link>
        
      </div>
      {/* <div className="col-md-4 offset-md-2 bg-cp-asbestos py-3">
        <form className="text-white ">
            <label htmlFor="categories">Categories</label>
            <hr />
            <label htmlFor="pricerange">Prices:</label>
            <hr />
            <label htmlFor="hasmodel">Has model?</label>
        </form>
      </div> */}

      <br />
      
    </div>
  );
};

export default Products;
