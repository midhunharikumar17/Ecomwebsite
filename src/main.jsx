import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // ✅ Add persistence
import { store, persistor } from "./redux/store"; // ✅ Export persistor from store
import "./index.css"; // ✅ Single CSS entry point

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ FIX 4: Redux Provider is outermost — everything can access the store */}
    <Provider store={store}>
      {/* ✅ FIX 6: PersistGate prevents flash-of-unauthenticated on refresh */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);