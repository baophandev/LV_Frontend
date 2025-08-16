import { RouterProvider } from "react-router-dom";
import router from "./routes";
import GlobalErrorHandler from "./components/GlobalErrorHandler";

function App() {
  return (
    <GlobalErrorHandler>
      <RouterProvider router={router} />
    </GlobalErrorHandler>
  );
}

export default App;
