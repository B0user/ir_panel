import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, Navigate, useParams } from "react-router-dom";
import QRCode from "../qrcodes/QRCode";
import {BASE_URL} from "../../config";


const UPLOAD_URL   = '/files/upload/images';

const ReadProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const {id} = useParams();

  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumb, setThumb] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [changed, setChanged] = useState(false);
  const [changedFile, setChangedFile] = useState(false);


  useEffect(() => {
    setErrMsg("");
  }, []);

  const {data:hasModel} = useQuery(['models-for-product'], () => axiosPrivate.get(`/models/${id}`).then((res)=> res.data));

  const {error, isLoading, isError} = useQuery(['product-info'], () => axiosPrivate.get(`/products/${id}`).then((res)=> {
    const info = res.data[0];
    setName(info.name); 
    setDescription(info.description);
    setPrice(info.price);
    return info;
  }));

  
  if(isLoading) return(
      <span className='spinner-border'/>
  )
  if(isError) return(
      <p>Что-то пошло не так... {error}</p>
  )
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if( changedFile ) {
        const formData = new FormData();
        formData.append('thumb', thumb);
        const result = await axiosPrivate.post(
          UPLOAD_URL,
          formData,
          {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }
        )

        await axiosPrivate.put(
          `/products/${id}`,
          JSON.stringify({ 
            name: name,
            description: description,
            price: price,
            thumb_id: result.data.file_id, 
            thumb_path: result.data.path 
          })
        );
      }
      else {
        await axiosPrivate.put(
          `/products/${id}`,
          JSON.stringify({ 
            name: name,
            description: description,
            price: price
          })
        );
      }
      setSuccess(true);
      //clear state and controlled inputs
      setName("");
      setDescription("");
      setPrice("");
      setThumb("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Update process failed");
      }
      errRef.current.focus();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.delete(`/products/${id}`);
      setSuccess(true);
      setName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Delete process failed");
      }
      errRef.current.focus();
    }
  }

  return (
    success 
    ? <Navigate to="/client/products" replace /> 
    : <div> 
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        > 
          {errMsg}
        </p>
        <h1 className="text-center">Информация о товаре</h1>
        <form>
          <label htmlFor="cat" className="form-label" >Категория:</label>
          <select className="form-select" disabled>
            <option value="">None</option>
          </select>

          <label htmlFor="name" className="form-label" >Наименование:</label>
          <input
            className="form-control" 
            type="text"
            id="name"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => { 
                setName(e.target.value);  
                setChanged(true);}}
            value={name}
            required
          />

          <label htmlFor="description" className="form-label" >Описание:</label>
          <textarea 
            className="form-control" 
            rows="3" id="description" name="text"
            onChange={(e) => {
                setDescription(e.target.value);  
                setChanged(true);}}
            value={description}
            required
          />

          <label htmlFor="price" className="form-label" >Цена:</label>
          <input
            className="form-control" 
            type="number"
            id="price"
            onChange={(e) => {
                setPrice(e.target.value.toString());  
                setChanged(true);}}
            value={price}
            required
          />
          <label htmlFor="thumb" className="form-label">Загрузить обложку</label> 
          <input 
          name="thumb"
          type="file" 
          id="thumb" 
          onChange={(e) => {
            setThumb(e.target.files[0])
            setChangedFile(true);
          }}
          className="form-control"
          required
          />
          <br />
          {hasModel?.length ?
            <div className="container-fluid text-white bg-primary text-center py-2">
              <span>Link to model: <Link to={`/modelview/${id}`}>{`inroom.tech/modelview/${id}`}</Link></span>
              <QRCode url={`${BASE_URL}/modelview/${id}`} isImage={false} isButton={true}/>
            </div>
            : <></>
          }
          <br />
          <div>
            <button onClick={(e) => handleUpdate(e)} className="btn btn-cp bg-cp-nephritis col-8" disabled={(!changed && !changedFile) ? true : false}>Обновить</button>
            <button onClick={(e) => handleDelete(e)} className="btn btn-cp bg-cp-pomegranate col-3 offset-1">Удалить</button>
          </div>
        </form>
        <p>
          <span className="line">
            <Link to="/client/products">Отмена</Link>
          </span>
        </p>
    </div>  
  );
}

export default ReadProduct