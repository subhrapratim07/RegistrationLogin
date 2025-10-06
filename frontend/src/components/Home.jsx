import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import Nav from "./Nav";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [role, setRole] = useState(null); // null when not logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedRole) setRole(storedRole);
    if (storedEmail) setIsLoggedIn(true);
  }, []);

  const offerCards = [
    {
      id: 1,
      image: "/offer1.png",
      title: "Weekend Special Combo",
      desc: "Enjoy a full meal with drinks and dessert at a special price every weekend!",
    },
    {
      id: 2,
      image: "/offer2.jpeg",
      title: "Butter Chicken Delight",
      desc: "Our signature creamy butter chicken is a customer favorite you must try.",
    },
    {
      id: 3,
      image: "/offer3.jpeg",
      title: "Creamy Alfredo Pasta",
      desc: "Rich, creamy, and packed with flavor – a must-have for pasta lovers.",
    },
  ];

  const handleCardClick = () => {
    navigate("/Order");
  };

  return (
    <>
      <style>{`
        .hero-section {
          background-image: url('/homebg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-section {
            background-image: url('/homebgs.png');
          }
        }
        .hero-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, rgba(0,0,0,0), #000);
          z-index: 2;
        }
        .offer-section {
          background-image: url('/offerbg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .offer-card {
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .offer-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
      `}</style>

      <Nav />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-gradient" />
        <div
          className="container d-flex align-items-center"
          style={{
            minHeight: "calc(100vh - 80px)",
            paddingTop: "60px",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div className="row w-100">
            <div className="col-12 col-md-8 col-lg-6 px-4 py-5">
              <h1 className="display-3 fw-bold text-warning lh-sm">
                WELCOME TO CRAVORY
              </h1>
              <div className="mt-4 mb-4 text-white fw-bold fs-5 lh-base">
                – a place where every <br /> dish is a story of
                <br />
                passion, flavor, and <br />irresistible cravings.
              </div>

              <div className="mt-4 d-flex gap-3 flex-wrap">
                {/* Always show ORDER NOW */}
                <Link to="/Order" className="btn btn-warning">
                  ORDER NOW!
                </Link>

                {/* Show BOOK TABLE only if a user or admin is logged in */}
                {isLoggedIn && (
                  <Link to="/BookTable" className="btn btn-danger">
                    BOOK TABLE
                  </Link>
                )}

                {/* Admin-only buttons */}
                {isLoggedIn && role === "admin" && (
                  <>
                    <Link to="/Item" className="btn btn-secondary">
                      Add Item!
                    </Link>
                    <Link to="/Reports" className="btn btn-secondary">
                      REPORTS!
                    </Link>
                    <Link to="/AssignDeliveryPerson" className="btn btn-secondary">
                      AssignDeliveryPerson!
                    </Link>
                    <Link
                      to="/DeliveryPersonForm"
                      className="btn btn-outline-warning"
                    >
                      DeliveryPerson
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="offer-section">
        <div className="container py-5">
          <h2 className="text-center text-light mb-4 fw-bold">
            What We Offer
          </h2>
          <div className="row g-4">
            {offerCards.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                <div
                  className={`card h-100 shadow-sm offer-card ${
                    hoveredCard === item.id ? "hovered" : ""
                  }`}
                  onClick={handleCardClick}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="card-text">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
