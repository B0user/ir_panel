import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, Navigate, useParams } from "react-router-dom";
import QRCode from "../qrcodes/QRCode";
import { BASE_URL } from "../../config";
// Design
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Header from "../../components/Header";

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useMediaQuery from "@mui/material/useMediaQuery";

const UPLOAD_THUMB_URL = "/files/upload/thumb";
const UPLOAD_IMAGES_URL = "/files/upload/images";

const ReadProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
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

  const { error, isLoading, isError, refetch } = useQuery(
    ["product-info"],
    () =>
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
        console.log(result);

        const imagePaths = result.data.paths;
        console.log(imagePaths);

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

      toast.success("Продукт обновлен", {
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
  };

  const handleArchivateModel = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      await axiosPrivate.put(`/models/exact/${id}/archivate`);
      toast.info("Архивация модели завершена", {
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
    setSpomaChain([...spomaChain, { size: "", price: "", old_price: "" }]);
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
      <Box m="20px">
      <Header
              title="Информация о товаре"
              subtitle="Форма заполнения данных о товаре"
            />
      <form>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cat">Категория:</InputLabel>
            <Select className="form-select" enabled>
              <MenuItem value="carpet">Ковры</MenuItem>
              <MenuItem value="sofa">Диваны</MenuItem>
              <MenuItem value="chair">Стулья</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="filled"
            type="text"
            id="name"
            inputRef={userRef}
            autoComplete="off"
            onChange={(e) => {
              setName(e.target.value);
              setChanged(true);
            }}
            value={name}
            required
            label="Наименование:"
            multiline
            rows={2}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              style: {
                fontSize: "16px", // Замените на нужный вам размер шрифта
              },
            }}
          />

          <TextField
            fullWidth
            variant="filled"
            multiline
            rows={3}
            id="description"
            name="text"
            onChange={(e) => {
              setDescription(e.target.value);
              setChanged(true);
            }}
            value={description}
            required
            label="Описание:"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Ссылка на товар"
            type="text"
            id="link"
            onChange={(e) => {
              setLink(e.target.value.toString());
              setChanged(true);
            }}
            value={link}
            required
            multiline
            rows={3}
            sx={{ marginBottom: "16px" }}
            inputProps={{
              style: {
                fontSize: "16px", // Замените на нужный вам размер шрифта
              },
            }}
          />

          <FormControl fullWidth variant="filled" sx={{ marginBottom: "16px" }}>
            <InputLabel htmlFor="thumb" sx={{ fontSize: "20px" }} shrink>
              Загрузить обложку
            </InputLabel>
            <Input
              type="file"
              id="thumb"
              onChange={(e) => {
                setThumb(e.target.files[0]);
                setChangedFile(true);
              }}
              inputProps={{
                accept: "image/*",
                id: "thumb",
              }}
              sx={{ display: "none" }}
              disabled
            />
            <InputAdornment position="end">
              <IconButton component="label" htmlFor="thumb" color="secondary">
                <CloudUploadIcon />
                <input
                  name="thumb"
                  type="file"
                  id="thumb"
                  onChange={(e) => {
                    setThumb(e.target.files[0]);
                    setChangedFile(true);
                  }}
                  style={{ display: "none" }}
                  disabled
                />
              </IconButton>
            </InputAdornment>
          </FormControl>

          <FormControl fullWidth variant="filled" sx={{ marginBottom: "16px" }}>
            <InputLabel htmlFor="images" sx={{ fontSize: "20px" }} shrink>
              Загрузить изображения
            </InputLabel>
            <Input
              type="file"
              id="images"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setImages(files);
                setChangedImages(true);
              }}
              inputProps={{
                accept: "image/*",
                id: "images",
                multiple: true,
              }}
              sx={{ display: "none" }}
              disabled
            />
            <InputAdornment position="end">
              <IconButton component="label" htmlFor="images" color="secondary">
                <CloudUploadIcon />
                <input
                  name="images"
                  type="file"
                  id="images"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImages(files);
                    setChangedImages(true);
                  }}
                  inputProps={{
                    accept: "image/*",
                    id: "images",
                    multiple: true,
                  }}
                  style={{ display: "none" }}
                  disabled
                />
              </IconButton>
            </InputAdornment>
          </FormControl>
        </Box>
        
        <TableContainer component={Paper}  sx={{ marginTop: "20px", backgroundColor: (theme) => theme.palette.primary.main,}}>
  <Table className="spoma-table" sx={{ minWidth: 650 }}>
    <TableHead>
      <TableRow>
        <TableCell>#</TableCell>
        <TableCell>Размер</TableCell>
        <TableCell>Цена</TableCell>
        <TableCell>Старая цена</TableCell>
        <TableCell>Модель</TableCell>
        <TableCell>Действия</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {spomaChain.map((chain, index) => (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            <TextField
              type="text"
              name="size"
              onChange={(e) => handleChangeSpomaChain(index, e)}
              value={chain.size}
              fullWidth
              variant="standard"
              required
            />
          </TableCell>
          <TableCell>
            <TextField
              type="number"
              name="price"
              onChange={(e) => handleChangeSpomaChain(index, e)}
              value={chain.price}
              fullWidth
              variant="standard"
            />
          </TableCell>
          <TableCell>
            <TextField
              type="number"
              name="old_price"
              onChange={(e) => handleChangeSpomaChain(index, e)}
              value={chain.old_price}
              fullWidth
              variant="standard"
            />
          </TableCell>
          <TableCell>
            {chain.model ? (
              chain.active ? (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={`${BASE_URL}/modelview/${clientID}/${id}?size=${chain.size}`}
                >
                  Ссылка
                </Link>
              ) : (
                "АРХИВ"
              )
            ) : (
              "Нет модели"
            )}
          </TableCell>
          <TableCell>
            <IconButton
              color="secondary"
              onClick={() =>
                chain.model
                  ? handleArchivateModel(chain.model)
                  : handleRemoveSpomaChain(index)
              }
            >
              <FontAwesomeIcon icon={faMinus} />
            </IconButton>
            <IconButton color="secondary" onClick={handleAddSpomaChain}>
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
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
          <Button
            onClick={(e) => handleUpdate(e)}
            disabled={!changed && !changedFile && !changedImages ? true : false}
            fullWidth
            variant="contained"
            size="small"
            color="secondary"
            sx={{ marginBottom: "16px" , fontSize: "18px", fontWeight: "500", color: "white"}}
          >
            Обновить
          </Button>
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
      </Box>
    </div>
  );
};

export default ReadProduct;
