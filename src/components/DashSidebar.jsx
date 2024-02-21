import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiChartPie,
  HiViewBoards,
  HiInbox,
  HiArrowSmRight,
  HiTable,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

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
  return (
    <Sidebar className="w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              label={currentUser.role=='admin'?'admin':'user'}
              labelColor="dark"
              active={tab == "profile"}
              icon={HiChartPie}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.role == "admin" && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item icon={HiViewBoards} active={tab == "posts"} as='div'>
                Post
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item href="#" icon={HiInbox} label="3">
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
