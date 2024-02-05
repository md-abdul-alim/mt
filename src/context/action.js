import axios from "axios";
const ROOT_URL = "http://127.0.0.1:8000/";

export async function MachineList(dispatch) {
  const requestOptions = {
    headers: {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  };

  try {
    dispatch({ type: "REQUEST_MACHINE_LIST" });
    await axios
      .get("/api/machine/list")
      .then((res) => {
        dispatch({
          type: "MACHINE_LIST_SUCCESS",
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: "MACHINE_LIST_ERROR",
          error: err,
        });
      });
  } catch (error) {
    dispatch({ type: "MACHINE_LIST_ERROR", error: error });
  }
}
