import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useDisconnect } from "wagmi";

import { compareInLowerCase } from "@/lib/utils";

import { ConnectedContext } from "./ConnectedContext";

export interface AuthContextValue {
  signerAddress: string;
}

export interface AuthContextProps {
  auth?: AuthContextValue;
}

export const defaultAuthContextValue = {
  auth: undefined,
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContextValue);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { connected } = useContext(ConnectedContext);
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const [auth, setAuth] = useState<AuthContextValue>();

  useEffect(() => {
    if (!disconnect || !connected || !session) {
      setAuth(undefined);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _session = session as any;
    const sessionAddress = _session.address;
    if (!compareInLowerCase(connected.signerAddress, sessionAddress)) {
      if (connected.signerAddress) {
        disconnect();
        setAuth(undefined);
      }
    }
    const signerAddress = connected.signerAddress;
    setAuth({ signerAddress });
  }, [disconnect, connected, session]);
  return <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>;
};
