import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import bike from "../assets/images/bike.jpg";
import wolverine from "../assets/images/wolverine.jpg";
import joker from "../assets/images/joker.jpg";

const spanStyle = {
  padding: "20px",
  background: "#efefef",
  color: "#000000",
};

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "800px",
};
const slideImages = [
  {
    url: bike,
    caption: "Bike ",
  },
  {
    url: wolverine,
    caption: "wolverine",
  },
  {
    url: joker,
    caption: "joker",
  },
];

const Slider = () => {
  return (
    <div className="slide-container">
      <Slide>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div
              style={{ ...divStyle, backgroundImage: `url(${slideImage.url})` }}
            >
              <span style={spanStyle}>{slideImage.caption}</span>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
};
export default Slider;
