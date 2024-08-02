import React from "react";

import Modal from 'react-bootstrap/Modal';
import { Formik,Form } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
const AdminProfile = () => {
  const [employeeData, setEmployeeData] = useState("");
  const [relationsData, setRelationsData] = useState("");
  const [documentsData, setDocumentsData] = useState("");
  const { userId } = useSelector((state) => state.auth);
  const [update,setUpdate] = useState(false)
  const axiosInstance = useAxios();
  const id = userId;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProfilePicSubmit = async (values, { setSubmitting, setErrors }) => {
    const formData = new FormData();
    if (values.profile) formData.append('profile', values.profile);
    try {
      const response = await axiosInstance.patch(`/profile/${id}/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });       
      //  setEmployeeData((prevData) => ({       //this will create a new temporary url and update the pic
      //   ...prevData,
      //   profile: URL.createObjectURL(values.profile),
      // }));
      setEmployeeData(response.data)
      handleClose()
      Swal.fire('Success!', 'Profile Pic Updated Successfully!', 'success');
      console.log('Success:', response.data);
      } catch (error) {
          console.error('Error:', error);
          setErrors({ api: 'Failed to update Profile Image' });
      } finally {
          setSubmitting(false);
      }       
  }

  useEffect(() => {
    axiosInstance.get(`/profile/${userId}/`).then((res) => {
      setEmployeeData(res.data);
      setRelationsData(res.data["relations"][0]);
      setDocumentsData(res.data["documents"][0]);
    });
  }, []);

  console.log("hello", employeeData);

  return (
    <>
      <div className="dashBoardrow">
        <div className="dashBoardcol1">
          <div
            style={{
              marginLeft: `20px`,
              display: `flex`,
            }}
          >
            <div
              className="e-card e-card-horizontal"
              style={{ marginLeft: `50px` }}
            >
              <div className="e-card-stacked">
                <div className="e-card-header">
                  <div className="e-card-header-caption">
                    <div className="e-card-header-title">Basic Information</div>
                  </div>
                  <div className="e-card-content">
                    <div>First Name: {employeeData["first_name"]}</div>
                    <div>Last Name : {employeeData["last_name"]}</div>
                    <div>Email : {employeeData["email"]}</div>
                    <div>Date Of Birth : {employeeData["dob"]}</div>
                    <div>Phone No : {employeeData["phone_number"]}</div>
                    <div>Address: {employeeData["address"]}</div>
                    <div>Bio : {employeeData["bio"]} </div>
                    <div>Gender : {employeeData["gender"]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashBoardcol2">
          <div
            style={{
              marginLeft: `0px`,
              display: `flex`,
            }}
          >
            <div className="e-card-stacked documentsData">
              <div className="e-card-header">
                <div className="e-card-header-caption">
                  <div className="e-card-header-title">Employee Documents</div>
                </div>
                <div className="e-card-content">
                  <div>
                    <p>
                      Pan Card No : {documentsData && documentsData["pan_card"]}
                    </p>
                    <p>
                      Aadhar Card No :
                      {documentsData && documentsData["aadhar_card"]}
                    </p>
                    <p>
                      Pan Image : {documentsData && (
                        <Link
                          to={`http://127.0.0.1:8000/media/${documentsData["pan_image"]}`}
                        >
                          {documentsData["pan_image"]}
                        </Link>
                      )}
                    </p>
                    <p>
                      Aadhar Image :
                      {documentsData && (
                        <Link
                          to={`http://127.0.0.1:8000/media/${documentsData["aadhar_image"]}`}
                        >
                          {documentsData["aadhar_image"]}
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Image</Modal.Title>
          <Modal.Body>
            <Formik
            initialValues={{
              profile : ''
            }}
            onSubmit={handleProfilePicSubmit}
            >
          {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                            <Form>
                                <h3 className="Auth-form-title">Employee Documents</h3>
                                {errors.api && <p className="text-danger">{errors.api}</p>}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    name="profile"
                                    onChange={(event) => {
                                        setFieldValue('profile', event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                    className={touched.profile && errors.profile ? 'is-invalid' : ''}
                                />
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </Form>
                        )}
            </Formik>
          </Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="dashBoardrow">
        <div className="dashBoardcol3">
            <div className="e-card-stacked documentsDetails">
              <div className="e-card-header">
                <div className="e-card-header-caption">
                  <div className="e-card-header-title">Company Relations</div>
                </div>
                <div className="e-card-content">
                  <div>
                    <p>
                      Designation : {relationsData && relationsData["designation"]}
                    </p>
                    <p>Department : {relationsData && relationsData["department"]}</p>
                    <p>Batch : {relationsData && relationsData["batch"]}</p>
                    <p>
                      Joining Date : {relationsData && relationsData["joining_date"]}
                    </p>
                    <p>
                      Probabation End Date 
                      {relationsData && relationsData["probation_end_date"]}
                    </p>
                    <p>
                      Work Duration :
                      {relationsData && relationsData["work_duration"]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashBoardcol4">
            <img id="profileImage"  src={employeeData["profile"]} alt="Profile Image"/>
            <Button variant="primary" onClick={handleShow}>
              Update Profile Picture
          </Button>
          </div>
        </div>

      <div className="editButton">
        <Link to="/dashboard/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </>
  );
};

export default AdminProfile;
