import { UseDispatch, useDispatch } from "react-redux";
export default function UserPage() {
  const dispatch = useDispatch();
  return (
    <form
      onSubmit={(e) => {
        // e.preventDefault();
        dispatch({ type: "LOGOUT" });
      }}
    >
      <button type="submit">logout</button>
    </form>
  );
}
