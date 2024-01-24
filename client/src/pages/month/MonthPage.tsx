import "./MonthPage.css";
import Timeline from "../../components/timeline/Timeline";
import { useParams, useNavigate } from "react-router-dom";
import { current } from "../../tools/data";
export default function MonthPage() {
  const navigate = useNavigate();
  const { year, month, mode } = useParams();
  const currentYear = current.year;

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
          mode : {mode || "view"} as
        </button>
        {month !== "0" ? (
          month !== undefined ? (
            <button
              onClick={() => {
                navigate(`/${year || currentYear}/0/${mode}`);
              }}
              className="viewAllLink Link"
            >
              view all
            </button>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
