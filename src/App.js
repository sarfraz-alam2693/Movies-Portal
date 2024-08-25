import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import "./assets/css/style.css";
import SignUp from "./Component/SignUp";
import Dashboard from "./Component/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Gallery from "./Component/Gallery";
import Movie from "./Component/Movie";
import ToDo from "./Component/ToDo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/gallery" element={<Gallery />}></Route>
          <Route path="/create/movie" element={<Movie />}></Route>
          <Route path="create/todo" element={<ToDo />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
