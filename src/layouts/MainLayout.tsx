import NavBar from "../components/NavBar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
