import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

const FooterComp = () => {
  return (
    <Footer className="border-2 border-t-8 border-teal-500 mt-10" container>
      <div className="w-full grid gap-10 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="font-semibold dark:text-white flex-1">
          <Link to="/" className="font-bold text-2xl dark:text-white">
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg px-2 text-white">
              CDAC
            </span>
            Blog
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:gap-14 md:grid-cols-3">
          <div>
            <Footer.Title title="about" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Flowbite</Footer.Link>
              <Footer.Link href="#">Tailwind CSS</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow us" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Github</Footer.Link>
              <Footer.Link href="#">Discord</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Privacy Policy</Footer.Link>
              <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        <Footer.Divider className="col-span-2 m-0 border-2 border-teal-500" />
        <div className="col-span-2 gap-2 flex flex-col justify-center items-center">
          <Footer.Copyright href="#" by="Flowbite™" year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
