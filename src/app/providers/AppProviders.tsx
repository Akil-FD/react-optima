import { AuthProvider } from "../../store/useAuth";

const AppProvider = ({ children }: any) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
