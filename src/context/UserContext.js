import React from "react";
import axios from "axios";
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return { ...state, isAuthenticated: false };
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, userDetails: action.payload };
      case "LOGIN_FAILURE":
        return { ...state, isAuthenticated: false};
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("refresh_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, isLoading) {
  setError(false);
  setIsLoading(true);
  
  if (!!login && !!password) {
    const requestOptions = {
      headers: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    };
    // dispatch({ type: 'REQUEST_LOGIN' });
    axios
      .post("/api/token/", {"username": login, "password": password}, requestOptions)
      .then((res) => {
        setTimeout(() => {
          localStorage.setItem('refresh_token', res.data.refresh)
          localStorage.setItem('access_token', res.data.access)
          localStorage.setItem('id', res.data.id)
          localStorage.setItem('first_name', res.data.first_name)
          localStorage.setItem('last_name', res.data.last_name)
          setError(null)
          dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
          setIsLoading(false)
          history.push('/app/dashboard')
        }, 1000);
      })
      .catch((err) => {
        setError(true);
        setIsLoading(false);
        // dispatch({ type: "LOGIN_FAILURE" });
      });
  
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("refresh_token");
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_type');
  localStorage.removeItem('unit');
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
