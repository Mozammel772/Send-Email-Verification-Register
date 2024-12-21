import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
// import { AuthContext } from "../../Pages/Register/AuthProvider/AuthProvider";
// import { AuthContext } from "../../LoginPages/AuthProvider/AuthProvider";

const Container = ({ children, className }) => {
  return (
    <div className={twMerge("max-w-screen-xl mx-auto px-3", className)}>
      {children}
    </div>
  );
};

const navigationLinks = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "/app" },
  { title: "Service", link: "/all-repair-services" },
  { title: "Service Request", link: "/service-request" },
  { title: "Service Post", link: "/all-repair-service-post" },
  { title: "Dashboard", link: "/dashboard/home" },
  { title: "Register", link: "/register" },
];

const Navbar = () => {
  //   const { user, logOut } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  //   const [cart] = useCart();
  const location = useLocation();
//   const { user, logOut } = useContext(AuthContext);
  // console.log("current user", user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY >= 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "LogOut SuccessFully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: error.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div
      className={`h-20 w-full fixed top-0 left-0 z-50 duration-300 bg-red-200 ${
        isScrolled ? "bg-red-300 text-blue-900" : "bg-transparent text-black"
      }`}
    >
      <Container className="h-full flex items-center justify-between">
        {/* <h1 className="text-xl font-bold">Repair</h1> */}
        <img src="https://i.ibb.co.com/g9KzBP1/fdd54d90-3481-43a9-ae3c-fe802a677c82.jpg" alt="logoDark" className="w-14 rounded-xl " />

        <div className="hidden md:flex items-center gap-x-6 uppercase text-xs lg:text-sm font-medium tracking-wide">
          {navigationLinks.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className={twMerge(
                "hover:text-white duration-200 cursor-pointer relative group overflow-hidden",
                location.pathname === item.link ? "text-orange-500" : ""
              )}
            >
              {item.title}
              <span className="w-full h-[1px] bg-white inline-block absolute bottom-0 left-0 -translate-x-[110%] group-hover:translate-x-0 duration-300" />
            </Link>
          ))}

          {/* <Link
            to="/login"
            className={location.pathname === "/login" ? "text-orange-500" : ""}
          >
            Login
          </Link> */}
          {/* <Link to={"/dashboard/cart"}>
            <button className="btn">
              <RiShoppingCartFill />
              <div className="badge badge-secondary">+{cart.length}</div>
            </button>
          </Link>  */}
          {/* {user ? (
            <>
              <span>{user?.displayName}</span>
              <span onClick={handleLogout} className="cursor-pointer">
                LogOut
              </span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={
                  location.pathname === "/login" ? "text-orange-500" : ""
                }
              >
                Login
              </Link>
            </>
          )} */}
        </div>

        <Menu
          onClick={toggleMenu}
          size={25}
          className="hover:text-white cursor-pointer md:hidden"
          aria-label="Open menu"
        />
      </Container>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 md:hidden text-white/80"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 ">
          <DialogPanel className="w-[94%] space-y-4 p-6 border border-lightText rounded-md absolute top-10 m-5 bg-gray-800">
            <div className="flex items-center justify-between gap-5">
              <h3 className="font-semibold text-xl">Navigation Menu</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 text-2xl hover:text-red-600 duration-300 border border-white/20 rounded-sm hover:border-white/40"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-5 pt-5 cursor-pointer">
              {navigationLinks.map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  className={twMerge(
                    "hover:text-white relative group flex items-center gap-2 cursor-pointer",
                    location.pathname === item.link
                      ? "text-orange-500"
                      : "text-white"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-white/80 inline-flex group-hover:border-white" />
                  {item.title}
                  <span className="absolute w-full h-[1px] bg-white/20 left-0 -bottom-1 group-hover:bg-white duration-300" />
                </Link>
              ))}
              {/* <Link to={"/dashboard/cart"}>
                <button className="btn">
                  <RiShoppingCartFill />
                  <div className="badge badge-secondary">+0</div>
                </button>
              </Link> */}
              {/* {user ? (
                <span
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="hover:text-white text-white"
                >
                  LogOut
                </span>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={
                    location.pathname === "/login"
                      ? "text-orange-500"
                      : "text-purple-300 font-mono text-xl font-bold"
                  }
                >
                  Login
                </Link>
              )} */}
              {/* <Link
                to="/login"
                className={
                  location.pathname === "/login" ? "text-orange-500" : ""
                }
              >
                Login
              </Link> */}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Navbar;
