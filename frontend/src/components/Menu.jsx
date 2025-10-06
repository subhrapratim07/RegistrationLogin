import { useEffect, useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import "react-toastify/dist/ReactToastify.css";

const Menu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px breakpoint for mobile
    };
    handleResize(); // Run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Nav />
      <div className="container text-center mt-4 mb-5">
        <img
          src={isMobile ? "/mobile menu.png" : "/laptop menu.png"}
          alt="Cravory Menu"
          className="img-fluid rounded shadow"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "15px" }}
        />
      </div>
      <Footer />
    </>
  );
};

export default Menu;
