import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./layouts/Navbar";
import PostExplore from "./sections/explore/PostExplore";
import ExploreDetails from "./sections/explore/exploredetails/ExploreDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<PostExplore />} />
          <Route path="explore/details" element={<ExploreDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
