import { UseDispatch, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
export default function UserPage() {
  const dispatch = useDispatch();
  return (
    <>
      <Navbar />
      <form
        onSubmit={(e) => {
          // e.preventDefault();
          dispatch({ type: "LOGOUT" });
        }}
      >
        <button type="submit">logout</button>
      </form>
    </>
  );
}
