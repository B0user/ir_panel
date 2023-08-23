import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, Link, useNavigate} from "react-router-dom"

const ShowProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const theme = useTheme();
    const navigate = useNavigate();
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
          price: item.spoma_chain[0]?.price || "", // Возможно, нужно скорректировать доступ к цене
          active: item.active
        }));
    }
    console.log(simplifiedData);
    
    const colors = tokens(theme.palette.mode);
    const columns = [
      { field: "id", headerName: "ID" },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        cellClassName: "name-column--cell",
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        headerAlign: "left",
        align: "left",
      },
      {
        field: "isActive",
        headerName: "Active",
        flex: 1,
      }
    //   },
    //   {
    //     field: "email",
    //     headerName: "Email",
    //     flex: 1,
    //   },
    //   {
    //     field: "accessLevel",
    //     headerName: "Access Level",
    //     flex: 1,
    //     renderCell: ({ row: { access } }) => {
    //       return (
    //         <Box
    //           width="60%"
    //           m="0 auto"
    //           p="5px"
    //           display="flex"
    //           justifyContent="center"
    //           backgroundColor={
    //             access === "admin"
    //               ? colors.greenAccent[600]
    //               : access === "manager"
    //               ? colors.greenAccent[700]
    //               : colors.greenAccent[700]
    //           }
    //           borderRadius="4px"
    //         >
    //           {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
    //           {access === "manager" && <SecurityOutlinedIcon />}
    //           {access === "user" && <LockOpenOutlinedIcon />}
    //           <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
    //             {access}
    //           </Typography>
    //         </Box>
    //       );
    //     },
    //   },
    ];
    if(mockDataTeam) return (
      <Box m="20px">
        <Header title="TEAM" subtitle="Managing the Team Members" />
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
          <DataGrid checkboxSelection rows={simplifiedData} columns={columns} />
        </Box>
      </Box>
    );
  };
  
  export default ShowProducts;
  