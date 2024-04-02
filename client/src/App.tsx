import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import TimelinePage from "./pages/TimelinePage/TimelinePage";

export default function App() {
  return (
    <>
      <Navbar />
      <TimelinePage />
      <Outlet />
    </>
  );
}
