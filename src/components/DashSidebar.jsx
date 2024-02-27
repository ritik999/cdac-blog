import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiArrowSmRight
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.userData);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className="w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              label={currentUser.user.userRole=='admin'?'admin':'user'}
              labelColor="dark"
              active={tab == "profile"}
              icon={HiUser}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.user.userRole == "admin" && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item icon={HiDocumentText} active={tab == "posts"} as='div'>
                Post
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.user.userRole == "admin" && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item icon={HiOutlineUserGroup} active={tab == "users"} as='div'>
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item className="cursor-pointer" icon={HiArrowSmRight} onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
