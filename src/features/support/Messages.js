import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

const MessageRecord = ({record, refetch}) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const deleteRecord = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      await axiosPrivate.delete(`/reports/${id}`)
      toast.info('Запрос отклонен и удален', {
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
      toast.error(`Ошибка при архивации продукта: ${err}`, {
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

  const readRecord = async (id) => {
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

  return(
    <div className="info d-flex justify-content-between align-items-center ms-3 py-1 border-bottom">
      <li>
        {`${record?.title?.substring(0,20)}...`} <i>{`by ${record?.messages[0]?.date.substr(0,10)}`}</i>
      </li>
      <div className="icons">
        <button
          className="btn btn-primary me-2 rounded-pill"
          onClick={() => readRecord(record._id)}
        >
          Больше
        </button>
        <span className="ms-2">
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => deleteRecord(record._id)}
          />
        </span>
      </div>
    </div>
  )
}

const ListMessages = ({ data, refetch }) => {
  return (
    <>
    {data?.length ? (
      <ul className="ps-0 ms-1" id="cats">
        {data.map((record) => 
        <MessageRecord record={record} refetch={refetch} key={record._id}/>
        )}
      </ul>
    ) : (
      <p>Нет записей</p>
    )}
    </>
  )
}
const Messages = ({isClosed, isPublic}) => {
  const axiosPrivate = useAxiosPrivate();
  const [searchResults, setSearchResults] = useState();
  const { data:messages, error, isLoading, isError, refetch } = useQuery(
    ["messages"], 
    () => axiosPrivate.get("/reports").then((res) => res.data),
    {
      onSuccess: (data) => setSearchResults(data)
    }    
  );

  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... {error}</p>;
  return (
    
    <div className="row">
      <h1 className="text-center mb-4">{isClosed ? "[РЕШЕНО] " : ""}Список отзывов и предложений</h1>
      <h3>Тикеты:</h3>
      <div className="wrapper ">
        <ListMessages data={searchResults?.filter(message => message.isClosed === isClosed && (message.title === "Public MV report") === isPublic )} refetch={refetch}/>
      </div>
    </div>
  )
}

export default Messages
