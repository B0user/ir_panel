import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, Navigate, useParams } from "react-router-dom";
import QRCode from "../qrcodes/QRCode";
import { BASE_URL } from "../../config";
// Design
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

const UPLOAD_THUMB_URL = "/files/upload/thumb";
const UPLOAD_IMAGES_URL = "/files/upload/images";

const ReadProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  const userRef = useRef();
  const errRef = useRef();

  const [clientID, setClientID] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [thumb, setThumb] = useState("");
  const [images, setImages] = useState("");
  const [spomaChain, setSpomaChain] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [changed, setChanged] = useState(false);
  const [changedFile, setChangedFile] = useState(false);
  const [changedImages, setChangedImages] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, []);

  const { error, isLoading, isError, refetch } = useQuery(["product-info"], () =>
    axiosPrivate.get(`/products/${id}`).then((res) => {
      const info = res.data[0];
      setClientID(info.client_id);
      setName(info.name);
      setDescription(info.description);
      setSpomaChain(info.spoma_chain);
      setLink(info.link);
      return info;
    })
  );

  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... {error}</p>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (changedFile) {
        const formData = new FormData();
        formData.append("thumb", thumb);
      
        let result = await axiosPrivate.post(UPLOAD_THUMB_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
        await axiosPrivate.put(`/products/${id}`, {
          name: name,
          description: description,
          spoma_chain: spomaChain,
          link: link,
          thumb_path: result.data.path,
        });
      } else if (changedImages) {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      
        let result = await axiosPrivate.post(UPLOAD_IMAGES_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log( result);
      
        const imagePaths = result.data.paths;
        console.log( imagePaths);
        
        await axiosPrivate.put(`/products/${id}`, {
          name: name,
          description: description,
          spoma_chain: spomaChain,
          link: link,
          image_paths: imagePaths,
        });
      } else {
        await axiosPrivate.put(`/products/${id}`, {
          name: name,
          description: description,
          spoma_chain: spomaChain,
          link: link,
        });
      }
      
      toast.success('Продукт обновлен', {
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
      setName("");
      setDescription("");
      setSpomaChain([]);
      setLink("");
      setThumb("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.toString());
      }
      errRef.current.focus();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteAction();
  };

  const deleteAction = async () => {
    try {
      await axiosPrivate.delete(`/products/${id}`);
      setSuccess(true);
      setName("");
      setDescription("");
      setSpomaChain([]);
      setLink("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Delete process failed");
      }
      errRef.current.focus();
    }
  }

  const handleArchivateModel = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      await axiosPrivate.put(`/models/exact/${id}/archivate`);
      toast.info('Архивация модели завершена', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      refetch();
    } catch (err) {
      toast.error(`Ошибка при архивации модели: ${err}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      console.error(err);
    }
  };

  const handleChangeSpomaChain = (id, event) => {
    setChanged(true);
    const newSpomaChain = spomaChain.map((chain, index) => {
      if (id === index) {
        chain[event.target.name] = event.target.value;
      }
      return chain;
    });
    setSpomaChain(newSpomaChain);
  };

  const handleAddSpomaChain = () => {
    setChanged(true);
    setSpomaChain([...spomaChain, { size: "", price: "", old_price: ""}]);
  };

  const handleRemoveSpomaChain = (id) => {
    setChanged(true);
    const values = [...spomaChain];
    values.splice(id, 1);
    if (values.length) setSpomaChain(values);
  };

  return success ? (
    <Navigate to="/panel/products" replace />
  ) : (
    <div>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1 className="text-center">Информация о товаре</h1>
      <form>
        <label htmlFor="cat" className="form-label">
          Категория:
        </label>
        <select className="form-select" disabled>
          <option value="">None</option>
        </select>

        <label htmlFor="name" className="form-label">
          Наименование:
        </label>
        <input
          className="form-control"
          type="text"
          id="name"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => {
            setName(e.target.value);
            setChanged(true);
          }}
          value={name}
          required
        />

        <label htmlFor="description" className="form-label">
          Описание:
        </label>
        <textarea
          className="form-control"
          rows="3"
          id="description"
          name="text"
          onChange={(e) => {
            setDescription(e.target.value);
            setChanged(true);
          }}
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
          onChange={(e) => {
            setLink(e.target.value.toString());
            setChanged(true);
          }}
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
          onChange={(e) => {
            setThumb(e.target.files[0]);
            setChangedFile(true);
          }}
          disabled
          className="form-control"
        />

        <label htmlFor="images" className="form-label">
          Загрузить изображения
        </label>
        <input
          name="images"
          type="file"
          id="images"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImages(files);
            setChangedImages(true);
          }}
          multiple
          className="form-control"
        />


        <table className="table spoma-table mt-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Размер</th>
              <th scope="col">Цена</th>
              <th scope="col">Старая цена</th>
              <th scope="col">Модель</th>
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
                    className="form-control-plaintext"
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    onChange={(e) => handleChangeSpomaChain(index, e)}
                    value={chain.price}
                    className="form-control-plaintext"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="old_price"
                    onChange={(e) => handleChangeSpomaChain(index, e)}
                    value={chain.old_price}
                    className="form-control-plaintext"
                  />
                </td>
                <td>
                  {chain.model
                  ? chain.active
                    ? (
                      <a target="_blank" rel="noreferrer" href={`${BASE_URL}/modelview/${clientID}/${id}?size=${chain.size}`}>
                        Ссылка
                      </a>
                    )
                    : "АРХИВ "
                  : "Нет модели "}
                </td>
                <td>
                  <span className="ms-2">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={() => chain.model ? handleArchivateModel(chain.model) : handleRemoveSpomaChain(index)}
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
        <div className="bg-primary container-fluid d-flex flex-column flex-wrap justify-content-center py-2 text-center text-white">
          <span>
            Ссылка на примерку:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`${BASE_URL}/modelview/${clientID}/${id}`}
            >{`inroom.tech/modelview/${clientID}/${id}`}</a>
          </span>
          <QRCode
            url={`${BASE_URL}/modelview/${clientID}/${id}`}
            isImage={false}
            isButton={true}
          />
        </div>
        <br />
        <div>
          <button
            onClick={(e) => handleUpdate(e)}
            className="btn btn-cp bg-cp-nephritis col-8"
            disabled={!changed && !changedFile && !changedImages ? true : false}
          >
            Обновить
          </button>
          <button
            onClick={(e) => handleDelete(e)}
            className="btn btn-cp bg-cp-pomegranate col-3 offset-1"
          >
            Удалить
          </button>
        </div>
      </form>
      <p>
        <span className="line">
          <Link to="/panel/products">Отмена</Link>
        </span>
      </p>
    </div>
  );
};

export default ReadProduct;
