import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheam } from "../redux/theam/theamSlice";
import { signoutSuccess } from "../redux/user/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const { theam } = useSelector((state) => state.theam);

  console.log(currentUser);
  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/v1/users/signout/${currentUser.user._id}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        // navitage('/sign-in')
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2">
      <Link className="text-sm sm:text-xl dark:text-white font-semibold">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          CDAC
        </span>
        Blog
      </Link>
      {/* <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form> */}
      <Button className="w-12 h-10 lg:hidden inline" color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-1">
        <Button
          className="w-12 h-10 border-none"
          color="gray"
          onClick={() => dispatch(toggleTheam())}
          pill
        >
          {theam === "light" ? <FaSun /> : <FaMoon />}
          {/* <FaMoon /> */}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser?.user?.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                @{currentUser?.user?.username}
              </span>
              <span className="block text-sm font-medium">
                {currentUser?.user?.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" pill>
              Sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
