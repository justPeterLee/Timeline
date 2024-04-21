import { useParams, useNavigate } from "react-router-dom";
// import { current } from "../../tools/data";
import { current } from "../../tools/data/monthData";

export function ViewLinks({ page }: { page: string }) {
  const navigate = useNavigate();
  const { year, month, mode } = useParams();

  const yearRoute = `/year/${year || current.year}/${
    mode === undefined ? "create" : mode === "view" ? "create" : "view"
  }`;
  const monthRouter = `/month/${year || current.year}/${
    month || current.today.month + 1
  }/${mode === undefined ? "create" : mode === "view" ? "create" : "view"}`;

  return (
    <div className="linkButton">
      <button
        onClick={() => {
          navigate(page === "year" ? yearRoute : monthRouter);
        }}
        className="viewAllLink Link"
      >
        mode : {mode || "view"}
      </button>
      {month && (
        <button
          onClick={() => {
            navigate(`/year/${year || current.year}/view`);
          }}
          className="viewAllLink Link"
        >
          view all
        </button>
      )}
    </div>
  );
}

export function ValidInput(props: {
  value: string;
  setValue: (value: string) => void;
  inputStyle?: {
    width?: string;
    height?: string;
    fontSize?: string;
    color?: string;
  };
  placeholder?: string;
  label: string;

  error?: {
    label: string;
    state: boolean;
  };
}) {
  return (
    <div className="valid-input-container">
      <input
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        style={props.inputStyle}
        className="valid-input"
        id={`${props.label}`}
        placeholder={props.placeholder}
      />
      <label
        className="valid-label"
        htmlFor={`${props.label}`}
        style={{
          transform: props.value.replace(/\s+/g, "") ? "translateY(16px)" : "",
        }}
      >
        {props.label}
      </label>

      {props.error && props.error.state ? (
        <label className="error-label" htmlFor={`${props.label}`}>
          {`* ${props.error.label}`}
        </label>
      ) : (
        <></>
      )}
    </div>
  );
}
