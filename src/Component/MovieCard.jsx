import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
function MovieCard(props) {
  console.log("props", props);
  const { title, description, movieImage } = props.data;
  // const title = props.data.title
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={`http://localhost:8000/images/${movieImage}`}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="info">Movie Details</Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;
