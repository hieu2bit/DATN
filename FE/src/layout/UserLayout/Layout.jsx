import { Outlet } from "react-router-dom";
import Header from "./Header.jsx"; // Assuming you have a Navbar component
import Footer from "./Footer.jsx";

function UserLayout() {
  return (
    <div className="user-layout">
      <Header />
      <main className="layout-main min-h-96">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
