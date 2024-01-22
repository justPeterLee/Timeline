import { Link, useParams } from "react-router-dom";
import "./App.css";
import Timeline from "./components/timeline/Timeline";

function App() {
  const { year, month, mode } = useParams();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Timeline />
      <div className="linkButton">
        <Link
          to={`/${year || currentYear}/${month || 0}/${
            mode === "view" ? "create" : "view"
          }`}
          className="viewAllLink Link"
        >
          mode : {mode}
        </Link>
        {month && (
          <Link
            to={`/${year || currentYear}/0/${mode}`}
            className="viewAllLink Link"
          >
            view all
          </Link>
        )}
      </div>
    </>
  );
}

export default App;
