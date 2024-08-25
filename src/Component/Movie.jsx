import Menu from "./Menu";
import { Modal, Button, Container, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

function Movie() {
  const [showCreateMovieModal, setShowCreateMovieModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [errors, setErrors] = useState({});
  const [movieList, setMovieList] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const [modelButton, setModelButton] = useState("");
  //Auto call once the page is load
  useEffect(() => {
    // GET Movie API
    axios.get("http://localhost:8000/api/movie/list").then((response) => {
      if (response.status === 200) {
        setMovieList(response.data.data);
      }
    });
  }, []);

  //Validation
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "title is required.";
    }

    if (!description.trim()) {
      newErrors.description = "description is required.";
    } else if (description.length < 5) {
      newErrors.description = "description must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalClose = () => {
    setShowCreateMovieModal(false);
  };

  //Save Movie
  const handleSaveMovie = () => {
    if (!validateForm()) {
      toast.error("Please correct your forms");
      return;
    }
    // Create Payload
    const payload = {
      title: title,
      description: description,
      rating: rating,
    };

    //Invoke API
    axios
      .post("http://localhost:8000/api/movie/create", payload)
      .then(function (response) {
        // console.log("response", response);
        if (response.status === 200) {
          // current data in response
          // All table data in movieList
          setMovieList((prevList) => {
            return [...prevList, response.data.data];
          });

          toast.success(response.data.message);
          setShowCreateMovieModal(false);
          setTitle("");
          setDescription("");
          setRating("");
        }
      });
  };

  // when i click eidt button open modal and set State of elow varriables
  const editMovieModal = (item) => {
    setShowCreateMovieModal(true);
    setMovieId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setRating(item.rating);
    setModelButton("");
  };

  // update Movie api
  const handleUpdateMovie = () => {
    // Values coming from State
    const payload = {
      title: title,
      description: description,
      rating: rating,
    };
    axios
      .put(`http://localhost:8000/api/movie/update/${movieId}`, payload)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message[0]);
          setShowCreateMovieModal(false);
          setMovieList((prevList) =>
            prevList.map((elem) =>
              elem.id === response.data.data.id ? response.data.data : elem
            )
          );
        }
      });
  };
  const deleteMovies = (item) => {
    const conf = window.confirm("Are you sure want to Delete this record ?");

    if (conf) {
      // console.log("confirm");

      axios
        .delete(`http://localhost:8000/api/movie/delete/${item.id}`)
        .then((response) => {
          // console.log("response", response);
          // console.log("response.data", response.status);
          // console.log("response.data", typeof response.status);
          if (response.status === 200 && response.data.success === true) {
            setMovieList((prevList) =>
              prevList.filter((elem) => elem.id !== item.id)
            );
            toast.success(response.data.message);
          }
        });
    }
  };
  return (
    <>
      <Menu />
      <Container>
        <div className="row">
          <div className="col-md-11">
            <h2>Movie</h2>
            <Link
              onClick={() => {
                setModelButton("addMovie");
                setMovieId("");
                setTitle("");
                setDescription("");
                setRating("");
                setShowCreateMovieModal(true);
              }}
              className="btn btn-primary float-end"
            >
              Add Movie
            </Link>
            <Table striped bordered hover>
              <thead>
                <tr key="Movie Title">
                  <th className="table-dark">Title</th>
                  <th className="table-dark">Description</th>
                  <th className="table-dark">Rating</th>
                  <th className="table-dark">Action</th>
                </tr>
              </thead>
              <tbody>
                {movieList &&
                  movieList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.rating}</td>
                      <td>
                        <Link onClick={() => editMovieModal(item)}>Edit</Link>
                        <br></br>
                        <Link onClick={() => deleteMovies(item)}>Delete</Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Modal for creating a movie */}
      <Modal show={showCreateMovieModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {/* {console.log("modelButton", modelButton)} */}
            {modelButton === "addMovie" ? "Create Movie" : "Update Movie"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Movie creation form goes here */}
          <form>
            <div className="mb-3">
              <label htmlFor="movieTitle" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="movieTitle"
                placeholder="Enter  title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {errors.title && (
                <span className="error-text">{errors.title}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="movieDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="movieDescription"
                rows="3"
                placeholder="Enter  description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              type="text"
              className="form-control"
              id="rating"
              placeholder="Enter  Rating"
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            />
            {errors.rating && (
              <span className="error-text">{errors.rating}</span>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {modelButton === "addMovie" ? (
            <Button variant="primary" onClick={handleSaveMovie}>
              Save Movies
            </Button>
          ) : (
            <Button variant="primary" onClick={handleUpdateMovie}>
              Update Movies
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Movie;
