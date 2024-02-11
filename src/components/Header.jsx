import { Button, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Header = () => {

    const path=useLocation().pathname;
    console.log(path);

  return (
    <Navbar className="border-b-2">
      <Link className="text-sm sm:text-xl dark:text-white font-semibold">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          CDAC
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden inline" color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-1">
        <Button className="w-12 h-10 border-none" color="gray" pill>
          <FaMoon />
        </Button>

        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" pill>Sign in</Button>
        </Link>
        
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path==='/'}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path==='/about'}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path==='/projects'}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
