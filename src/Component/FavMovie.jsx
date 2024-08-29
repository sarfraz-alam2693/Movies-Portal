import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MovieCard from "./MovieCard";

function FavMovie() {
  const API = "http://localhost:8000/api";
  const [favMovieList, setFavMovie] = useState([]);
  const [title, setFavTitle] = useState("");
  const [movieId, setMovieId] = useState("");
  const [isMovieCard, setisMovieCard] = useState(false);
  const [description, setdescription] = useState("");
  const [movieImage, setmovieImage] = useState("");

  useEffect(() => {
    axios.get(`${API}/movie/list`).then((response) => {
      //   console.log("response", response);
      setFavMovie(response.data.data);
    });
  }, []);

  //onchange title
  const handleSelectMOvies = (e) => {
    console.log("e.target.value", e.target.value);
    if (!e.target.value) {
      toast.error("Please select movie");
      setisMovieCard(false);
      return false;
    }

    const movieId = e.target.value;
    setMovieId(movieId);
    const selectedMovie = favMovieList.find((elem) => elem.id === movieId);
    setFavTitle(selectedMovie.title);
    setdescription(selectedMovie.description);
    setmovieImage(selectedMovie.image);

    setisMovieCard(true);
  };

  // Add Fav Movie
  const handleAddFavMovie = (e) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const payload = {
      movieId: movieId,
      title: title,
      userId: userData.userId,
    };
    axios.post(`${API}/user-movie/store`, payload).then((response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    });
  };

  return (
    <>
      <div>
        <div className="container">
          <div className="row">
            <h2>Fav Movies</h2>
            <div className="col-md-4">
              <select
                onChange={handleSelectMOvies}
                className="form-select"
                aria-label="Default select example"
              >
                <option value={""}>Select</option>
                {favMovieList &&
                  favMovieList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </select>
            </div>
            {
              // condtion ? true : false;
              isMovieCard === true ? (
                <div className="col-md-4">
                  <MovieCard data={{ title, description, movieImage }} />
                </div>
              ) : (
                ""
              )
            }
          </div>
          <div className="row">
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={handleAddFavMovie}>
                Add Fav MOvies
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FavMovie;
