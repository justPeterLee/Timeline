import { Link, useParams } from "react-router-dom";
import "./App.css";
import Timeline from "./components/timeline/Timeline";

function App() {
  const { month } = useParams();

  return (
    <>
      <Timeline />
      <div className="linkButton">
        <Link to={"/"} className="viewAllLink Link">
          mode : create
        </Link>
        {month && (
          <Link to={"/"} className="viewAllLink Link">
            view all
          </Link>
        )}
      </div>
    </>
  );
}

export default App;
