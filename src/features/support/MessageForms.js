import React, { useReducer } from "react";
import { toast } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const FormStart = ({refetch}) => {
    const axiosPrivate = useAxiosPrivate();
    const INITIAL_REPORT_STATE = {
      title: "",
      messages: [],
      details: {},
    };
    const reportReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_MESSAGES_INPUT":
          return {
            ...state,
            messages: [
              {
                source: "client",
                [action.payload.name]: action.payload.value,
                date: new Date(),
              },
            ],
          };
        case "CHANGE_TITLE":
          return {
            ...state,
            title: action.payload,
          };
        case "NULL":
          return INITIAL_REPORT_STATE;
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(reportReducer, INITIAL_REPORT_STATE);
    const handleReportInputChange = (e) => {
      dispatch({
        type: "CHANGE_MESSAGES_INPUT",
        payload: { name: e.target.name, value: e.target.value },
      });
    };
    const handleTitleChange = (e) => {
      dispatch({
        type: "CHANGE_TITLE",
        payload: e.target.value,
      });
    };
  
    const handleReportSubmit = async () => {
      if (state.messages?.length) {
        await axiosPrivate.post("/reports/client", state);
        toast.success('Запрос отправлен', {
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
      } else {
        console.log("CAPTCHA failed");
      }
    };
  
    return (
      <form className="form-control" onSubmit={(e) => e.preventDefault()}>
        <label
          htmlFor="title"
          className="form-label"
        >
          Тема:
        </label>
        <input type="text" name="title" className="form-control" onChange={handleTitleChange}/>
  
        <label htmlFor="text" className="form-label">
          Сообщение:
        </label>
        <textarea
          name="text"
          cols="30"
          rows="5"
          className="form-control"
          onChange={handleReportInputChange}
        />
        <button className="btn btn-sm btn-secondary disabled mt-1">
          Прикрепить файл
        </button>
        <br />
        <button
          className="btn btn-primary mt-2 px-3 rounded-pill"
          onClick={handleReportSubmit}
        >
          Отправить
        </button>
      </form>
    );
};

const FormReply = ({INITIAL_REPORT_STATE, source, refetch, id}) => {
    const axiosPrivate = useAxiosPrivate();
    const reportReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_MESSAGES_INPUT":
          return {
            ...state,
            messages: [
              ...INITIAL_REPORT_STATE.messages,
              {
                source: source,
                [action.payload.name]: action.payload.value,
                date: new Date(),
              },
            ],
          };
        case "NULL":
          return INITIAL_REPORT_STATE;
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(reportReducer, INITIAL_REPORT_STATE);
    const handleReportInputChange = (e) => {
      dispatch({
        type: "CHANGE_MESSAGES_INPUT",
        payload: { name: e.target.name, value: e.target.value },
      });
    };
  
    const handleReportSubmit = async () => {
      if (state.messages?.length) {
        console.log(state);
        await axiosPrivate.put(`/reports/${id}`, state);
        toast.success('Ответ отправлен', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        refetch();
      } else {
        console.log("CAPTCHA failed");
      }
    };
  
    return (
      <form className="form-control" onSubmit={(e) => e.preventDefault()}>  
        <label htmlFor="text" className="form-label">
          Сообщение:
        </label>
        <textarea
          name="text"
          cols="30"
          rows="5"
          className="form-control"
          onChange={handleReportInputChange}
        />
        <button className="btn btn-sm btn-secondary disabled mt-1">
          Прикрепить файл
        </button>
        <br />
        <button
          className="btn btn-primary mt-2 px-3 rounded-pill"
          onClick={handleReportSubmit}
        >
          Отправить
        </button>
      </form>
    );
}
export { FormStart, FormReply }
