import { useContext } from "react";

import { ConnectedContext } from "@/contexts/ConnectedContext";

export const useConnected = () => {
  const { connected } = useContext(ConnectedContext);
  return {
    connected,
  };
};
