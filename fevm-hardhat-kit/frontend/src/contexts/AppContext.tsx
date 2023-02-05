// import { AuthContextProvider } from "./AuthContext";
import { ConnectedContextProvider } from "./ConnectedContext";

export interface AppContextWapperProps {
  children: React.ReactNode;
}

// this is helper provider used in _app.tsx
// this context should be used in this order
export const AppContextProvider: React.FC<AppContextWapperProps> = ({ children }) => {
  return (
    <ConnectedContextProvider>
      {/* <AuthContextProvider> */}
      {children}
      {/* </AuthContextProvider> */}
    </ConnectedContextProvider>
  );
};
