import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillAnalysis from "./pages/bill";
import Sustainify from "./pages/operationM";
import PlantMap from "./pages/PlantMap";

function App() {
  return (

    <BrowserRouter>

      <Routes>
        <Route path="/" element={<BillAnalysis />} />
        <Route path="/map" element={<PlantMap />} />
        <Route path="/operation" element={<Sustainify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;