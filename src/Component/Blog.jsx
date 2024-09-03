import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import bike from "../assets/images/bike.jpg";
import Menu from "./Menu";
import { toast } from "react-toastify";

function Blog() {
  const [blog, setblog] = useState([]);
  const [blogId, setBlogId] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showCreateMovieModal, setShowCreateMovieModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [errors, seterror] = useState("");
  const [image, setImage] = useState(null);
  const [modelButton, setModelButton] = useState("");

  const handleShow = () => {
    setShowModal(true);
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview("");
    seterror("");
    setModelButton("Add Blog");
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/blogs`).then((response) => {
      // console.log("response", response);
      if (response.status === 200 && response.data.success === true) {
        setblog(response.data.data);
      }
    });
  }, []);
  const editMovieModal = (item) => {
    console.log("item", item);
    setBlogId(item.id);
    setModelButton("editBlog");
    setShowModal(true);
    setTitle(item.title);
    setDescription(item.description);
    setPreview(`http://localhost:8000/images/${item.image}`);
  };

  const handleSaveMovie = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData.userId;
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    // console.log("formdata", formData);

    axios
      .post(`http://localhost:8000/api/blog/store`, formData)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          toast.success(response.data.message);
        }
        setShowModal(false);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    console.log("close");
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteBlog = (item) => {
    const blogId = item.id;
    let conf = window.confirm("Are you sure want to delete");
    if (conf) {
      axios
        .delete(`http://localhost:8000/api/blog/delete/${blogId}`)
        .then((response) => {
          if (response.status === 200) {
            toast.error(response.data.message);
            setblog((previewList) => {
              return previewList.filter((elem) => elem.id != blogId);
            });
          }
        });
    }
  };

  const handleUpdateMovie = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    axios
      .post(`http://localhost:8000/api/blog/edit/${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("response", response);

        if (response.status === 200) {
          setShowModal(false);
          toast.success(response.data.message);

          setImage(null);
        }
      });
  };
  return (
    <>
      <div style={{ backgroundColor: "#f8f9fa", padding: "40px 0" }}>
        <Container>
          <Menu />
          <h2>Blogs</h2>
          <Row>
            <Col className="text-end">
              <Button className="btn btn-primary" onClick={handleShow}>
                Add Blog
              </Button>
            </Col>
          </Row>

          <Row>
            {blog && blog.length > 0 ? (
              blog.map((item, index) => (
                <Col lg="4" md="6" sm="12" key={index} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8000/images/${item.image}`}
                      alt={item.title}
                    />
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <Card.Footer>
                        <small className="text-muted">
                          Created: {item.created_at}
                        </small>
                        <br />
                        <small className="text-muted">
                          Updated: {item.updated_at}
                        </small>
                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            variant="info"
                            onClick={() => editMovieModal(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteBlog(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No blogs found.</p>
            )}
          </Row>

          {/* Add Blog Modal */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {modelButton === "Add Blog" ? "create Blog" : "Update Blog"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Your form or content for adding a blog */}
              <form>
                <div className="mb-3">
                  <label htmlFor="Title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Title"
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
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>

              {modelButton === "Add Blog" ? (
                <Button variant="primary" onClick={handleSaveMovie}>
                  Save Blog
                </Button>
              ) : (
                <Button variant="primary" onClick={handleUpdateMovie}>
                  Update Blog
                </Button>
              )}

              {/* <Button onClick={handleSaveBlog}>Save Blog</Button> */}
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
}
export default Blog;
