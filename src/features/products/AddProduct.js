import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

const ADDPRODUCT_URL = "/products";
const UPLOAD_URL = "/files/upload/images";

const AddProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [category, setCategory] = useState("carpet");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [thumb, setThumb] = useState("");
  const [spomaChain, setSpomaChain] = useState([
    { size: "", price: "", old_price: "" },
  ]);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [name, description, spomaChain]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("thumb", thumb);
      // Add files to media
      const result = await axiosPrivate.post(UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axiosPrivate.post(
        ADDPRODUCT_URL,
        JSON.stringify({
          category: category,
          name: name,
          description: description,
          spoma_chain: spomaChain,
          link: link,
          thumb_path: result.data.path,
        })
      );
      toast.success('Продукт добавлен', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      setSuccess(true);
      //clear state and controlled inputs
      setCategory("");
      setName("");
      setDescription("");
      setSpomaChain([{ size: "", price: "", old_price: "" }]);
      setLink("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Addition Failed");
      }
      errRef.current.focus();
    }
  };
  const handleChangeSpomaChain = (id, event) => {
    const newSpomaChain = spomaChain.map((chain, index) => {
      if (id === index) {
        chain[event.target.name] = event.target.value;
      }
      return chain;
    });
    setSpomaChain(newSpomaChain);
  };

  const handleAddSpomaChain = () => {
    setSpomaChain([...spomaChain, { size: "", price: "", old_price: "" }]);
  };

  const handleRemoveSpomaChain = (id) => {
    const values = [...spomaChain];
    values.splice(id, 1);
    if (values.length) setSpomaChain(values);
  };

  return (
    <>
      {success ? (
        navigate("/panel/products", { replace: true })
      ) : (
        <>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Добавить новый товар</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="cat" className="form-label">
              Категория:
            </label>
            <select
              className="form-select"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="carpet">Ковры</option>
              <option value="sofa">Диваны</option>
              <option value="chair">Стулья</option>
            </select>

            <label htmlFor="name" className="form-label">
              Наименование:
            </label>
            <input
              type="text"
              id="name"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              required
            />

            <label htmlFor="description" className="form-label">
              Описание:
            </label>
            <textarea
              className="form-control"
              rows="5"
              id="description"
              name="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />

            <label htmlFor="link" className="form-label">
              Ссылка на товар:
            </label>
            <input
              className="form-control"
              type="text"
              id="link"
              onChange={(e) => setLink(e.target.value.toString())}
              value={link}
              required
            />

            <label htmlFor="thumb" className="form-label">
              Загрузить обложку
            </label>
            <input
              name="thumb"
              type="file"
              id="thumb"
              onChange={(e) => setThumb(e.target.files[0])}
              className="form-control"
              disabled
            />

            {/* Table for SPOMA CHAINS */}
            <table className="table spoma-table mt-3">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Размер</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Старая цена</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {spomaChain.map((chain, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <input
                        type="text"
                        name="size"
                        onChange={(e) => handleChangeSpomaChain(index, e)}
                        value={chain.size}
                        className="form-control"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="price"
                        onChange={(e) => handleChangeSpomaChain(index, e)}
                        value={chain.price}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="old_price"
                        onChange={(e) => handleChangeSpomaChain(index, e)}
                        value={chain.old_price}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <span className="ms-2">
                        <FontAwesomeIcon
                          icon={faMinus}
                          onClick={() => handleRemoveSpomaChain(index)}
                        />
                      </span>
                      <span className="ms-2">
                        <FontAwesomeIcon
                          icon={faPlus}
                          onClick={handleAddSpomaChain}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="w-100 btn btn-sm btn-primary mb-3"
              onClick={handleAddSpomaChain}
            >
              Добавить размер
            </button>
            <br />
            <button className="btn btn-danger">Добавить</button>
          </form>
          <p>
            <span className="line">
              <Link to="/panel/products">Отмена</Link>
            </span>
          </p>
        </>
      )}
    </>
  );
};

export default AddProduct;
