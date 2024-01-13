import { Route, Routes } from "react-router-dom";
import Collections from "./pages/Collections";
import Collection from "./pages/Collection";
import MyCollection from "./pages/MyCollection";
import Dashboard from "./pages/Dashboard";
import Figurine from "./pages/Figurine";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Wish from "./pages/Wish";

import Navbar from './components/Navbar';
import PrivateRoutes from "./components/PrivateRoutes";
import PublicRoutes from "./components/PublicRoutes";

function App() {

    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<PrivateRoutes element={Dashboard} />} exact />

                <Route path="/login" element={<PublicRoutes element={<Login />} />} exact />
                <Route path="/search" element={<PrivateRoutes element={Search} />} exact />
                <Route path="/mycollection" element={<PrivateRoutes element={MyCollection} />} exact />
                <Route path="/wish" element={<PrivateRoutes element={Wish} />} exact />
                <Route path="/collections" element={<PrivateRoutes element={Collections} />} exact />
                <Route path="/collection/:collection" element={<PrivateRoutes element={Collection} />} exact />
                <Route path="/figurine/:figurine_id" element={<PrivateRoutes element={Figurine} />} exact />
            </Routes>
            
        </>
        
    );
}

export default App;
