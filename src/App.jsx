import { Route, Routes } from "react-router-dom";
import Collections from "./pages/Collections";
import Collection from "./pages/Collection";
import MyCollection from "./pages/MyCollection";
import Dashboard from "./pages/Dashboard";
import Navbar from './components/Navbar';
import Figurine from "./pages/Figurine";
import Login from "./pages/Login";
import Search from "./pages/Search";

import Wish from "./pages/Wish";
import PrivateRoutes from "./components/PrivateRoutes";
import PublicRoutes from "./components/PublicRoutes";


function App() {

    return (
        <>
            <Navbar />

            <Routes>
                <Route element={<PrivateRoutes />} >
                    <Route path="/" element={<Dashboard />} exact />

                    <Route path="/search" element={<Search />} exact />

                    <Route path="/mycollection" element={<MyCollection />} exact />

                    <Route path="/wish" element={<Wish />} exact />

                    <Route path="/collections" element={<Collections />} exact />

                    <Route path="/collection/:collection" element={<Collection />} exact />

                    <Route path="/figurine/:figurine_id" element={<Figurine />} exact />
                </Route>
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<Login />} exact />
                </Route>

            </Routes>

            {/* <Routes>
                <Route path="*" element={<PrivateRoutes element={Dashboard} />} />
                <Route path="/" exact element={<PrivateRoutes element={Dashboard} />} />
                <Route path="/login" element={<PrivateRoutes element={Login} />} />

                <Route path="/search" element={<PrivateRoutes element={Search} />} />

                <Route path="/mycollection" element={<PrivateRoutes element={MyCollection} />} />

                <Route path="/wish" element={<PrivateRoutes element={Wish} />} />

                <Route path="/collections" element={<PrivateRoutes element={Collections} />} />

                <Route path="/collection/:collection" element={<PrivateRoutes element={Collection} />} />

                <Route path="/figurine/:figurine_id" element={<PrivateRoutes element={Figurine} />} />
            </Routes> */}
        </>
    );
}

export default App;
