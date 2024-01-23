import { Link, useParams, useNavigate } from "react-router-dom";
import "./App.css";
import Timeline from "./components/timeline/Timeline";

function App() {
  const navigate = useNavigate();
  const { year, month, mode } = useParams();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Timeline />
      <div className="linkButton">
        <button
          onClick={() => {
            navigate(
              `/${year || currentYear}/${month || 0}/${
                mode === undefined
                  ? "create"
                  : mode === "view"
                  ? "create"
                  : "view"
              }`
            );
          }}
          className="viewAllLink Link"
        >
          mode : {mode || "view"}
        </button>
        {month !== "0" && (
          <button
            onClick={() => {
              navigate(`/${year || currentYear}/0/${mode}`);
            }}
            className="viewAllLink Link"
          >
            view all
          </button>
        )}
      </div>
    </>
  );
}

export default App;
