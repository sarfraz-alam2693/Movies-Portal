import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MovieCard from "./MovieCard";
import { Table, Button } from "react-bootstrap";
import Loader from "./Loader";

function FavMovie() {
  const API = "http://localhost:8000/api";
  const [loading, setLoading] = useState(true);
  const [favMovieList, setFavMovie] = useState([]);
  const [title, setFavTitle] = useState("");
  const [movieId, setMovieId] = useState("");
  const [isMovieCard, setisMovieCard] = useState(false);
  const [description, setdescription] = useState("");
  const [movieImage, setmovieImage] = useState("");
  const [movie, setmovie] = useState("");

  useEffect(() => {
    //Get the list of movie for dropdown
    axios.get(`${API}/movie/list`).then((response) => {
      setFavMovie(response.data.data);
    });

    //List of user movie
    const userData = JSON.parse(localStorage.getItem("userData"));
    let userId = userData.userId;
    axios.get(`${API}/user/favmovie/${userId}`).then((response) => {
      if (response.status === 200 && response.data.success === true) {
        setmovie(response.data.result);
        setLoading(false);
      }
    });
  }, []);

  //onchange title
  const handleSelectMOvies = (e) => {
    if (!e.target.value) {
      toast.error("Please select movie");
      setisMovieCard(false);
      return false;
    }

    const movieId = e.target.value;
    setMovieId(movieId);

    const selectedMovie = favMovieList.find((elem) => elem.id == movieId);

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
      console.log("response", response.data.data[0]);
      if (response.status === 200) {
        toast.success(response.data.message);
        setmovie((prevList) => [...prevList, response.data.data[0]]);
      }
    });
  };

  /**
   * Delete Fav Movie
   */
  const handleMoviesDelete = (item, e) => {
    e.preventDefault();
    const conf = window.confirm("Are you sure want to Delete this record ?");
    if (conf) {
      const movieId = item.id;
      axios.delete(`${API}/favmovie/delete/${movieId}`).then((response) => {
        console.log("response", response);
        if (response.data.success && response.status === 200) {
          toast.success(response.data.message);
          setmovie((prevList) => {
            return prevList.filter((elem) => elem.id != movieId);
          });
        }
      });
    }
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <h2>Fav Movies</h2>
            <div className="row">
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
              <div className="col-md-2">
                <button className="btn btn-primary" onClick={handleAddFavMovie}>
                  Add Fav MOvies
                </button>
              </div>
              <div className="col-md-6">
                <h2>Favorite Movies</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="table-dark">Name</th>
                      <th className="table-dark">Movie Title</th>
                      <th className="table-dark">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movie && movie.length > 0 ? (
                      movie.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.title}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={(e) => handleMoviesDelete(item, e)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No favorite movies found.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FavMovie;
