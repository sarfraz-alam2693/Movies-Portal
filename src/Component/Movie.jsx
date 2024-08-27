import Menu from "./Menu";
import { Modal, Button, Container, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

function Movie() {
  const API = "http://localhost:8000/api";
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
    axios.get(`${API}/movie/list`).then((response) => {
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
    if (!rating) {
      newErrors.rating = "Rating is required.";
    }

    if (!image) {
      newErrors.image = "Image is required.";
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
      // toast.error("Please correct your forms");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rating", rating);
    formData.append("image", image);

    axios
      .post(`${API}/movie/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        // console.log("response", response);
        if (response.status === 200) {
          setMovieList((prevList) => [...prevList, response.data.data]);
          toast.success(response.data.message);
          setShowCreateMovieModal(false);
          setTitle("");
          setDescription("");
          setRating("");
          setImage(null);
          setPreview("");
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
  // delete movies
  const deleteMovies = (item) => {
    const conf = window.confirm("Are you sure want to Delete this record ?");

    if (conf) {
      // console.log("confirm");

      axios.delete(`${API}/movie/delete/${item.id}`).then((response) => {
        if (response.status === 200 && response.data.success === true) {
          setMovieList((prevList) =>
            prevList.filter((elem) => elem.id !== item.id)
          );
          toast.success(response.data.message);
        }
      });
    }
  };

  /**
   * Function is used to handle image upload
   * @param {Event} e
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log("handlefilechange", file);
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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
                  <th className="table-dark">Image</th>
                  <th className="table-dark">Action</th>
                </tr>
              </thead>
              <tbody>
                {console.log("movieList", movieList)}
                {movieList &&
                  movieList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.rating}</td>
                      <td>
                        <img
                          src={`http://localhost:8000/images/${item.image}`}
                          alt=""
                          height={50}
                          width={50}
                        />
                      </td>

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
            <div>
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
            </div>
            <div>
              <label htmlFor="image" className="form-label">
                Choose Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
              {errors.image && (
                <span className="error-text">{errors.image}</span>
              )}
            </div>
            {/* Image Preview */}
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Movie"
                  style={{
                    width: "100px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </div>
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
