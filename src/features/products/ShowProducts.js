import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast, ToastContainer } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, Link, useNavigate} from "react-router-dom"
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { API_URL } from "../../config";
import {
  InputBase,
  IconButton,
  InputAdornment, TextField 
} from "@mui/material";
import { Search } from '@mui/icons-material';


const ShowProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const [searchText, setSearchText] = useState('');


    const [searchResults, setSearchResults] = useState();
    
    const { data:products, error, isLoading, isSuccess, isError, refetch } = useQuery(
    ["products"], 
    () => axiosPrivate.get("/products").then((res) => res.data),
    {
      onSuccess: (data) => setSearchResults(data)
    }    
  );

    if (isLoading) return <span className="spinner-border" />;
    if (isError) return <p>Что-то пошло не так... {error}</p>;

    console.log(products);
    let simplifiedData = {}
    if(isSuccess){
     simplifiedData = products?.map(item => ({
          id: item._id,
          name: item.name,
          link: `inroom.tech/modelview/${item.client_id}/${item._id}`, 
          status: item.active ? "published" : "archived", 
          editlink: `${item._id}`
        }));
    }
    console.log(simplifiedData);
    



    const handleSearchTextChange = (event) => {
      setSearchText(event.target.value);
    };
    
    const filteredRows = simplifiedData.filter((simplifiedData) =>
      simplifiedData.name.toLowerCase().includes(searchText.toLowerCase())
    );





    const colors = tokens(theme.palette.mode);
    const columns = [
      // { field: "id", headerName: "ID", width: 250 },
      { field: "name", headerName: "Наименование", width: 200 },
      {
        field: "link",
        headerName: "Ссылка",
        width: 110,
        renderCell: (params) => (
          <CopyToClipboard text={params.value}>
            <Button variant="contained" color="primary" onClick={() => {
              // Показываем уведомление при успешном копировании
              toast.success("Ссылка скопирована!");
            }}>
              Ссылка
            </Button>
          </CopyToClipboard>
        ),
      },
      {
        field: "status",
        headerName: "Статус",
        width: 280,
        renderCell: (params) => (
          <ToggleButtonGroup
            value={params.value}
            exclusive
            onChange={() => {
              // Handle status toggle button click here
            }}
          >
            <ToggleButton value="archived" aria-label="archived">
              Архивирован
            </ToggleButton>
            <ToggleButton value="published" aria-label="published">
              Опубликован
            </ToggleButton>
          </ToggleButtonGroup>
        ),
      },{
        field: "editlink", // Пустой поле для кнопки без заголовка
        headerName: "",
        width: 110,
        renderCell: (params) => (
          <Link to={params.value}>
            <Button
              variant="contained"
              color="secondary"
            >
              Изменить
            </Button>
          </Link>
        ),
      },
    ];
    if(mockDataTeam) return (

      <Box m="20px">




        <Header title="Список товаров" subtitle="Управление товарами" />

      

        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
        
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchText}
          onChange={handleSearchTextChange}
        />  
      
        
          {/* <DataGrid checkboxSelection rows={simplifiedData} columns={columns} /> */}
          <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>
        
      </Box>
    );
  };
  
  export default ShowProducts;
  