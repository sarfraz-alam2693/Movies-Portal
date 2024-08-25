import React from "react";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import bike from "../assets/images/bike.jpg";
import wolverine from "../assets/images/wolverine.jpg";
import joker from "../assets/images/joker.jpg";
import avenger from "../assets/images/avenger.webp";
import avenger1 from "../assets/images/avenger1.jpeg";
import avatar from "../assets/images/avatar.webp";
import hobit from "../assets/images/hobit.jpg";
import inception from "../assets/images/inception.jpeg";
import max from "../assets/images/max.jpeg";
import superman from "../assets/images/superman.jpeg";

function Gallery({ left }) {
  const images = [
    { original: joker, thumbnail: joker },
    { original: bike, thumbnail: bike },
    { original: wolverine, thumbnail: wolverine },
    { original: avenger, thumbnail: avenger },
    { original: avenger1, thumbnail: avenger1 },
    { original: avatar, thumbnail: avatar },
    { original: hobit, thumbnail: hobit },
    { original: inception, thumbnail: inception },
    { original: max, thumbnail: max },
    { original: superman, thumbnail: superman },
  ];
  //   const images = [
  //     {
  //       original: bike,
  //       thumbnail: bike,
  //     },
  //     {
  //       original: wolverine,
  //       thumbnail: wolverine,
  //     },
  //     {
  //       original: joker,
  //       thumbnail: joker,
  //     },
  //     {
  //       original: avenger,
  //       thumbnail: avenger,
  //     },
  //     {
  //       original: avenger1,
  //       thumbnail: avenger1,
  //     },
  //     {
  //       original: avatar,
  //       thumbnail: avatar,
  //     },
  //     {
  //       original: hobit,
  //       thumbnail: hobit,
  //     },
  //     {
  //       original: inception,
  //       thumbnail: inception,
  //     },
  //     {
  //       original: max,
  //       thumbnail: max,
  //     },
  //     {
  //       original: superman,
  //       thumbnail: superman,
  //     },
  //   ];

  return (
    <ReactImageGallery
      items={images}
      thumbnailPosition={left ? "left" : "bottom"} // Pass the thumbnailPosition prop here
    />
  );
}

export default Gallery;
