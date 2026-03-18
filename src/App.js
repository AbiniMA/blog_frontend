import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./layouts/Navbar";
import PostExplore from "./sections/explore/PostExplore";
import ExploreDetails from "./sections/explore/exploredetails/ExploreDetails";
import Dashboard from "./sections/dashboard/Dashboard";
import AddBlog from "./sections/blogs/AddBlog";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<PostExplore />} />
          <Route path="explore/details/:id" element={<ExploreDetails />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="add-blog"
            element={
              <ProtectedRoute>
                <AddBlog />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
