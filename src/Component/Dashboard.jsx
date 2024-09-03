import { Container } from "react-bootstrap";
// import Slider from "./Slider";
import Gallery from "./Gallery";

import Menu from "./Menu";

function Dashboard() {
  return (
    <>
      <div>
        <div style={{ backgroundColor: "#f8f9fa", padding: "40px 0" }}>
          <Container>
            <Menu />
            <div className="jumbotron">
              <h1 className="display-4">Movies world!</h1>
              <p className="lead">
                World cinema is a term in film theory in the United States that
                refers to films made outside of the American motion picture
                industry, particularly those in opposition to the aesthetics and
                values of commercial American cinema. The Third Cinema of Latin
                America and various national cinemas are commonly identified as
                part of world cinema. The term has been criticized for
                Americentrism and for ignoring the diversity of different
                cinematic traditions around the world.
              </p>
            </div>
            <h2>Dashboard</h2>
            <Gallery left={false} />

            {/* <Slider /> */}
          </Container>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
