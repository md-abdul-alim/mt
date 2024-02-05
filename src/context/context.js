import React, { useReducer } from "react";
import { MachineReducer } from "./reducer";
const MachineStateContext = React.createContext();
const MachineDispatchContext = React.createContext();

export function useMachineState() {
  const context = React.useContext(MachineStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }

  return context;
}

export function useMachineDispatch() {
  const context = React.useContext(MachineDispatchContext);
  if (context === undefined) {
    throw new Error("useMachineDispatch must be used within a AuthProvider");
  }

  return context;
}

export const MachineProvider = ({ children, initialState }) => {
  const [fabric, dispatch] = useReducer(MachineReducer, initialState);

  return (
    <MachineStateContext.Provider value={fabric}>
      <MachineDispatchContext.Provider value={dispatch}>
        {children}
      </MachineDispatchContext.Provider>
    </MachineStateContext.Provider>
  );
}
