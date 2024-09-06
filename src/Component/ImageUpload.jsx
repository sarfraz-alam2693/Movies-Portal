import React, { useState } from "react";
import axios from "axios";
const token = localStorage.getItem("token");

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("handlefilechange", file);
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("handleSubmit");

    const formData = new FormData();
    formData.append("image", selectedFile);

    axios
      .post(`http://localhost:8000/api/image/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
      });
  };

  return (
    <>
      <div className="conatiner">
        <div className="row">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {preview && (
                <div>
                  <h3>Image Preview:</h3>
                  <img
                    src={preview}
                    alt="Selected"
                    style={{ maxWidth: "300px", height: "auto" }}
                  />
                </div>
              )}
              <button type="submit">Upload Image</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
