import { useNavigate } from "react-router-dom";
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div>Page Not Found</div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        home
      </button>
    </div>
  );
}
