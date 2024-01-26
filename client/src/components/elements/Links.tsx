import { useParams, useNavigate } from "react-router-dom";
import { current } from "../../tools/data";
export function GlobalLinks() {
  const navigate = useNavigate();
  const { year, month, mode } = useParams();

  return (
    <div className="linkButton">
      <button
        onClick={() => {
          navigate(
            `/${year || current.year}/${month || 0}/${
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
      {month !== "0" ? (
        month !== undefined ? (
          <button
            onClick={() => {
              navigate(`/${year || current.year}/0/${mode}`);
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
  );
}
