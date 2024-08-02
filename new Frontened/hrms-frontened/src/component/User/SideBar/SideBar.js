import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { SidebarData } from "./SideBarData";
import logo from "../../../assets/hrms.png";
import { IconContext } from "react-icons/lib";
import SubMenu from "./SubMenu";
import { useDispatch, useSelector } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import "./SideBar.css";
import { Modal, Button } from "react-bootstrap";
import useAxios from "../../../hooks/useAxios";
import notification from "../../../assets/notificationIcon.png";
const Nav = styled.div`
  background: #ffffff;
  height: 80px;
  display: flex;
  justify-content: end;
  align-items: center;
  
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #112f4b;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;
const formatDate = (dateString) => {
  if (dateString === "-") return "-";
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleString(undefined, options);
};
const Sidebar = () => {
  const axiosInstance = useAxios();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [notificationData, setNotification] = useState([]);
  const { firstName } = useSelector((state) => state.auth);

  const { navTitle } = useSelector((state) => state.auth);

  const handleNotification = () => {
    axiosInstance.patch(`notification/`);
    setShowUpdateModal(true);
  };
  useEffect(() => {
    axiosInstance.get(`notification/`).then((res) => {
      setNotification(res.data);
      console.log("I got all the notification as user side", res.data);
    });
  }, []);

  return (
    <>
      <IconContext.Provider value={{ color: "#FFFFFF" }}>
        <header>
          <Nav>
            <div>
              <h1 className="headerNavBar">{navTitle}</h1>
            </div>

            <div className="navbar">
              <img
                src={notification}
                onClick={handleNotification}
                width="35px"
              ></img>
              <p>
                {notificationData.length > 0 &&
                  notificationData[0]["total_notification"]}
              </p>
              <Link to="#home">News</Link>
              <Link to="/calender">Calender</Link>
              <div className="dropdown">
                <button className="dropbtn">
                  {firstName}
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/change-password">Change Password</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              </div>
            </div>
          </Nav>
          <Modal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {notificationData.length > 0 ? (
                notificationData.map((notification) => (
                  <div id={notification.id}>
                    <pre>
                      {notification.employee_id.first_name}{" "}
                      {notification.message} {formatDate(notification.status)}
                    </pre>
                  </div>
                ))
              ) : (
                <h2>Notification Not Found</h2>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </header>

        <SidebarNav>
          <SidebarWrap>
            <NavIcon to="#">
              <img src={logo} alt="Logo" width={60} />
              <h3 style={{ color: "#FFFFFF" }}>eSparkBiz</h3>
            </NavIcon>
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
