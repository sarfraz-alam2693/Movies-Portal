import Menu from "./Menu";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

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
  const [search, setSearch] = useState("");

  //Auto call once the page is load
  const getMovieList = () => {
    axios.get(`${API}/movie/list`).then((response) => {
      if (response.status === 200) {
        setMovieList(response.data.data);
      }
    });
  };
  useEffect(() => {
    getMovieList();
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
    setPreview(`http://localhost:8000/images/${item.image}`);
    setModelButton("");
  };

  /**
   * Update Movie API use image input then method post
   */
  const handleUpdateMovie = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rating", rating);

    if (image) {
      formData.append("image", image);
    }

    axios
      .post(`${API}/movie/update/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          setShowCreateMovieModal(false);
          setImage(null);
          // update state of movieList
          setMovieList((prevList) =>
            prevList.map((elem) =>
              elem.id == response?.data?.data?.id ? response.data.data : elem
            )
          );
        }
      });
  };
  /**
   * delete movies
   */
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
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Search Movies
   */
  const handleSearchButton = () => {
    console.log("search", search);
    if (!search.length > 0) {
      toast.error("Search your movie");
    }

    axios
      .get(`http://localhost:8000/api/searchmovie?title=${search}`)
      .then((response) => {
        console.log("response", response);
        setMovieList(response.data.data);
      });
  };
  const handleCloseSearch = () => {
    console.log("xxxxxx");
    getMovieList();
  };

  return (
    <>
      <div style={{ backgroundColor: "#f8f9fa", padding: "40px 0" }}>
        <Container>
          <Menu />
          <Row>
            <Col md={4} className="mb-4">
              <h2>Movie</h2>
            </Col>
            <Col md={4} className="md-4">
              <Link
                onClick={() => {
                  setModelButton("addMovie");
                  setMovieId("");
                  setTitle("");
                  setDescription("");
                  setRating("");
                  setShowCreateMovieModal(true);
                }}
                className="btn btn-primary"
              >
                Add Movie
              </Link>
            </Col>
            <Col md={2} className="md-2">
              <input
                type="search"
                id="search"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={1} className="md-1">
              <Button
                className="btn btn-danger pull-right"
                onClick={handleCloseSearch}
              >
                X
              </Button>
            </Col>
            <Col>
              <Button md={1} className="md-1" onClick={handleSearchButton}>
                Search
              </Button>
            </Col>
          </Row>

          <hr
            style={{
              width: "50%",
              margin: "0 auto 20px auto",
              borderColor: "#ccc",
              borderColor: "#6c757d",
            }}
          />
          <Row>
            {movieList &&
              movieList.map((item, index) => (
                <Col key={index} md={3} className="mb-3">
                  <Card style={{ width: "18rem" }}>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8000/images/${item.image}`}
                      alt={item.title}
                      height="150px"
                      width="50px"
                    />
                    <Card.Body>
                      <Card.Title>
                        {item.title}
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: 12,
                            color: "gold",
                          }}
                        >
                          ({item.rating})
                        </span>
                      </Card.Title>
                      <Card.Text
                        style={{
                          maxHeight: "80px", // Set a fixed height
                          overflowY: "auto", // Enable vertical scrolling if content exceeds
                          whiteSpace: "normal", // Prevent text from being truncated
                        }}
                      >
                        {item.description}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => editMovieModal(item)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteMovies(item)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
      {/* Modal for creating a movie */}
      <Modal show={showCreateMovieModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
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
