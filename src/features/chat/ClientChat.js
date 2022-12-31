import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormStart } from "../support/MessageForms";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const ChatRecord = ({ record, refetch }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const handleOpenChat = () => navigate(record._id);
  const handleDeleteRecord = async (id) => {
    if (!id) {
      console.error("Empty ID");
      return;
    }
    try {
      await axiosPrivate.delete(`/reports/${id}`);
      refetch();
      toast.info('Вы удалили историю чата', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    
    } catch (err) {
      toast.error('Ошибка при удалениии чата', {
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
  }

  return (
    <tr>
      <th scope="row">{record?._id.substr(0,7)}...</th>
      <td onClick={handleOpenChat}>{record?.title}</td>
      <td>{record?.messages?.at(-1)?.date}</td>
      <td>
        <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteRecord(record._id)}/>
      </td>
    </tr>
  );
};
const HistoryChat = ({ data, refetch }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Тема</th>
          <th scope="col">Последнее сообщение</th>
          <th scope="col">
            <FontAwesomeIcon icon={faFilter} />
          </th>
        </tr>
      </thead>
      <tbody>
      {data?.map((record, key) => (
        <ChatRecord key={key} record={record} refetch={refetch}/>
      ))}
      </tbody>
    </table>
  );
};

const ClientChat = () => {
  const axiosPrivate = useAxiosPrivate();
  // Fetching history of Support Chats
  const {
    isLoading,
    isError,
    isSuccess,
    refetch,
    data: chats,
  } = useQuery(
    ["chats"],
    () => axiosPrivate.get(`/reports/client/`).then((res) => res.data),
    {}
  );
  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... </p>;
  if (isSuccess)
    return (
      <div>
        <h1>Помощь и поддержка</h1>
        <FormStart refetch={refetch}/>
        <br />
        <HistoryChat data={chats} refetch={refetch} />
        <div className="history"></div>
      </div>
    );
};

export default ClientChat;
