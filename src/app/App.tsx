import { Provider } from "react-redux";
import AppRoutes from "./routes";
import { store } from "../store/store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
