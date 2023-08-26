import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Input,
  InputAdornment,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ADDPRODUCT_URL = "/products";
const UPLOAD_THUMB_URL = "/files/upload/thumb";

const AddProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [category, setCategory] = useState("carpet");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [thumb, setThumb] = useState("");
  const [images, setImages] = useState([]);
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
      // for (let i = 0; i < images.length; i++) {
      //   formData.append("images", images[i]);
      // }

      let result = await axiosPrivate.post(UPLOAD_THUMB_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axiosPrivate.post(ADDPRODUCT_URL, {
        category: category,
        name: name,
        description: description,
        spoma_chain: spomaChain,
        link: link,
        thumb_path: result.data.path,
      });

      toast.success("Продукт добавлен", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "primary",
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
          <Box m="20px">
            <Header
              title="Добавить товар"
              subtitle="Форма заполнения данных о товаре"
            />
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <FormControl fullWidth variant="filled">
                  <InputLabel htmlFor="category">Категория:</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    inputProps={{
                      name: "category",
                      id: "category",
                    }}
                  >
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
                  sx={{ gridColumn: "span 2"}}
                  inputRef={userRef}
                  autoComplete="off"
                  multiline
                  rows={2}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  label="Наименование:"
                  InputLabelProps={{
                    shrink: true, // Сокращать метку, чтобы она не перекрывала текст при вводе
                  }}
                  inputProps={{
                    style: {
                      fontSize: "16px", // Замените на нужный вам размер шрифта
                    }
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  label="Описание"
                  multiline
                  rows={5}
                  id="description"
                  name="text"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                  sx={{ marginBottom: "16px" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  label="Ссылка на товар"
                  multiline
                  id="link"
                  onChange={(e) => setLink(e.target.value.toString())}
                  value={link}
                  rows={5}
                  required
                  sx={{ marginBottom: "16px" }}
                />
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ marginBottom: "16px" }}
                >
                  <InputLabel htmlFor="thumb" sx={{ fontSize: "20px" }} shrink>
                    Загрузить обложку
                  </InputLabel>
                  <Input
                    type="file"
                    id="thumb"
                    onChange={(e) => setThumb(e.target.files[0])}
                    inputProps={{
                      accept: "image/*",
                      id: "thumb",
                    }}
                    sx={{ display: "none" }}
                  />
                  <InputAdornment position="end">
                    <IconButton
                      component="label"
                      htmlFor="thumb"
                      color="secondary"
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </InputAdornment>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ marginBottom: "16px" }}
                >
                  <InputLabel htmlFor="images" shrink sx={{ fontSize: "20px" }}>
                    Загрузить дополнительные фото
                  </InputLabel>
                  <Input
                    name="images"
                    type="file"
                    id="images"
                    onChange={(e) => setImages(e.target.files)}
                    inputProps={{
                      accept: "image/*",
                      id: "images",
                      multiple: true,
                    }}
                    sx={{ display: "none" }}
                  />
                  <InputAdornment position="end">
                    <IconButton
                      component="label"
                      htmlFor="images"
                      color="secondary"
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </InputAdornment>
                </FormControl>
              </Box>

              {/* Table for SPOMA CHAINS */}
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: "70px",
                  backgroundColor: (theme) => theme.palette.primary.main,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Размер</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell>Старая цена</TableCell>
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
                            variant="outlined"
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
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            name="old_price"
                            onChange={(e) => handleChangeSpomaChain(index, e)}
                            value={chain.old_price}
                            fullWidth
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleRemoveSpomaChain(index)}
                            color="secondary"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </IconButton>
                          <IconButton
                            onClick={handleAddSpomaChain}
                            color="secondary"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                fullWidth
                variant="contained"
                size="small"
                color="secondary"
                sx={{ marginBottom: "16px" , fontSize: "18px", fontWeight: "500", color: "white"}}
                onClick={handleAddSpomaChain}
              >
                Добавить размер
              </Button>

              <Button variant="contained" color="error"
                size = "large" type = "submit" sx = {{marginBottom: "20px", fontWeight: "400", height: "50px", fontSize: "25px"}}>
                Добавить товар
              </Button>
            </form>
            <p>
              <span className="line">
                <Link to="/panel/products">Отмена</Link>
              </span>
            </p>
          </Box>
        </>
      )}
    </>
  );
};

export default AddProduct;
