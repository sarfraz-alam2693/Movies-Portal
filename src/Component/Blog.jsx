import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Menu from "./Menu";
import { toast } from "react-toastify";

function Blog() {
  const [blogList, setBlogList] = useState([]);
  const [blogId, setBlogId] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [errors, seterror] = useState("");
  const [image, setImage] = useState(null);
  const [modelButton, setModelButton] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const handleShow = () => {
    setShowModal(true);
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview("");
    seterror("");
    setModelButton("Add Blog");
  };
  const getBlogList = () => {
    axios
      .get(`http://localhost:8000/api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        if (response.status === 200 && response.data.success === true) {
          setBlogList(response.data.data);
        }
      });
  };
  useEffect(() => {
    getBlogList();

    document
      .querySelector('input[type="search"]')
      .addEventListener("input", function () {
        if (this.value === "") {
          getBlogList();
          // search logic here
          // this function will be executed when the search input is cleared
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

  const handleSaveBlog = () => {
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
      .post(`http://localhost:8000/api/blog/store`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          setBlogList((previewList) => [...previewList, response.data.data]);
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
        .delete(`http://localhost:8000/api/blog/delete/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("response", response);

          if (response.status === 200) {
            toast.error(response.data.message);
            setBlogList((previewList) => {
              return previewList.filter((elem) => elem.id !== blogId); //???
            });
          }
        });
    }
  };

  const handleUpdateBlog = () => {
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
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          setBlogList((prevList) =>
            prevList.map((elem) =>
              elem.id == blogId ? response.data.data : elem
            )
          );
          setShowModal(false);
          toast.success(response.data.message);
          setImage(null);
        }
      });
  };
  /**
   * Blog Search
   */
  const handleSearchButton = () => {
    console.log("search", search);
    if (!search.length > 0) {
      toast.error("Search your Blog");
    }

    axios
      .get(`http://localhost:8000/api/searchblog?searchData=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        setBlogList(response.data.data);
      });
  };
  // Close x search
  const handleCloseSearch = () => {
    getBlogList();
  };

  return (
    <>
      <div style={{ backgroundColor: "#f8f9fa", padding: "40px 0" }}>
        <Container>
          <Menu />
          <Row>
            <Col md={2}>
              <Button className="btn btn-primary" onClick={handleShow}>
                Add Blog
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col md={2} className="d-flex align-items-center">
              <input
                type="search"
                id="search"
                className="form-control me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button className="btn btn-danger" onClick={handleCloseSearch}>
                X
              </Button>
            </Col>

            <Col md={1}>
              <Button onClick={handleSearchButton}>Search</Button>
            </Col>
          </Row>
          <hr />
          <Row>
            {blogList && blogList.length > 0 ? (
              blogList.map((item, index) => (
                <Col lg="3" md="3" sm="3" key={index} className="mb-2">
                  <Card
                    style={{
                      height: "380px", // Set a fixed height for the card
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8000/images/${item.image}`}
                      alt={item.title}
                      style={{ height: "150px", objectFit: "cover" }} // Adjust the image height and object-fit to maintain aspect ratio
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Footer
                        style={{
                          maxHeight: "80px",
                          overflowY: "auto",
                          whiteSpace: "normal",
                          flexGrow: 1, // Make the footer flexible to take up space
                        }}
                      >
                        {item.description}
                      </Card.Footer>
                      <div className="mt-auto d-flex justify-content-between">
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
                <Button variant="primary" onClick={handleSaveBlog}>
                  Save Blog
                </Button>
              ) : (
                <Button variant="primary" onClick={handleUpdateBlog}>
                  Update Blog
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
}
export default Blog;
