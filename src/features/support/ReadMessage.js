import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormReply } from "./MessageForms";

const ReadMessage = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  // QUERY RESULT
  const { error, isLoading, isError, data, refetch } = useQuery(
    ["message"],
    () => axiosPrivate.get(`/reports/${id}`).then((res) => res.data)
  );
  if (isLoading) return <span className="spinner-border" />;
  if (isError) return <p>Что-то пошло не так... {error}</p>;

  // HANDLING FUNCTIONS
  const handleToWork = () => {
    toast.info("Запрос отправлен отделу разработки", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate(-1);
  };

  const handleClose = () => {
    // axiosPrivate.put(`${id}`, {})
    toast.success("Проблема решена", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <h1>Отзыв</h1>
      <article className="d-flex flex-column">
        <h2>Тема : {data?.title}</h2>

        {data?.messages?.map((message, id) => (
          <li className="message-info" key={id}>
            <p>
              <i>{`${id + 1} : ${message.date?.substr(0, 10)} От ${
                message?.source
              }`}</i>
            </p>
            <div className="message bg-white rounded-pill text-break py-2 px-3 mb-3 ">
              {message.text}
            </div>
            <button
              className={`btn btn-sm rounded-pill btn-outline-primary mb-4 ${
                message.file_path ? "" : "hide"
              }`}
            >
              Открыть скриншот
            </button>
          </li>
        ))}
        <hr />
        <FormReply
          INITIAL_REPORT_STATE={data}
          refetch={refetch}
          source={"support"}
          id={id}
        />
        <br />
        <div className="btn-group">
          <button className="btn btn-outline-danger" onClick={handleToWork}>
            В разработку
          </button>
          <button className="btn btn-outline-success" onClick={handleClose}>
            Закрыть
          </button>
          <button className="btn btn-outline-secondary" onClick={handleBack}>
            Отмена
          </button>
        </div>
      </article>
    </div>
  );
};

export default ReadMessage;
