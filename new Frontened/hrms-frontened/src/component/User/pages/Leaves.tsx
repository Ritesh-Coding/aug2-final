import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import useAxios from "../../../hooks/useAxios";
import { Button, Modal } from "react-bootstrap";
import { RootState } from "../../../types";
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import InputField from "../../../utils/InputField";
import Swal from 'sweetalert2';
import SelectField from "../../../utils/SelectField";
import { Link } from 'react-router-dom';
import { Pagination } from "../../../hooks/usePaginationRange";
import LeavesDeatils from "../../../utils/LeavesDeatils";
import DateTime from "../../../utils/DateTime";
import axios from "axios";

interface ApiErrorResponse {
  non_field_errors: string;
}

interface LeaveDayTypesFormat {
  date: string;
  type: string;
  leave_day_type: string;
  status?: string;
  reason: string;
  id?: number;
  api?: string;
}

const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  reason: Yup.string().required('Reason is required'),
  type: Yup.string().required('Type is required'),
  leave_day_type: Yup.string().required('Leave day type is required')
});

const Leaves: React.FC = () => {
  const dispatch = useDispatch();
  const [leaveData, setLeaveData] = useState<LeaveDayTypesFormat[]>([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const rowsPerPage = 5;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function myFunction() {
    const startDateElement = document.getElementById("startDate") as HTMLInputElement | null;
    const endDateElement = document.getElementById("endDate") as HTMLInputElement | null;

    if (startDateElement && endDateElement) {
      const startDate = startDateElement.value;
      const endDate = endDateElement.value;

      if (startDate && endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
        setCurrentPage(1);
      }
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRequestStatus(event.target.value);
    setCurrentPage(1);
  }

  const handleSubmit = async (values: LeaveDayTypesFormat, { setSubmitting, setErrors }: FormikHelpers<LeaveDayTypesFormat>) => {
    const { date, type, leave_day_type, reason } = values;
    try {
      const result = await axiosInstance.post('leave/', { date, type, leave_day_type, reason });
      const data = result.data;
      Swal.fire('Success!', 'Leave Request is Applied Successfully!', 'success');

      const notificationData = {
        "message": "Leave Request",
        "request_admin": "true"
      };
      await axiosInstance.post(`notification/?id=${userId}`, notificationData);
      console.log("Notification also registered");

      handleClose();
    } catch (err) {
      console.error("this is error i got ", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiErrorResponse;
        if (apiError.non_field_errors) {
          setErrors({ api: apiError.non_field_errors[0] });
        } else {
          setErrors({ api: 'An error occurred.' });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const leaveChoices = [
    { value: 'PL', label: 'PL' },
    { value: 'SL', label: 'SL' },
    { value: 'CL', label: 'CL' },
    { value: 'UL', label: 'UL' }
  ];

  const leaveDayTypes = [
    { value: 'Full_Day', label: 'Full Day' },
    { value: 'First_Half', label: 'First Half' },
    { value: 'Last_Half', label: 'Last Half' }
  ];

  const axiosInstance = useAxios();
  dispatch(navbarTitle({ navTitle: "Leaves" }));
  const { userId } = useSelector((state: RootState) => state.auth);
  console.log("i AM GETTING THE ID AS ", userId);

  function fetchLeaveData(page: number, status: string, start_date: string, end_date: string) {
    axiosInstance.get('leave/', {
      params: {
        page,
        status,
        start_date,
        end_date,
      }
    }).then((res) => {
      console.log("this is my result", res.data);
      setLeaveData(res.data["results"]);
      if (res.data.count === 0) {
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    });
  }

  useEffect(() => {
    fetchLeaveData(currentPage, requestStatus, startDate, endDate);
  }, [currentPage, requestStatus, startDate, endDate]);

  return (
    <>
      <div style={{ marginLeft: "250px" }}>
        <LeavesDeatils /> 
        <br />
        <Button variant="primary" onClick={handleShow}>
          Request Leave
        </Button>
        <Link to="/update-leave">
          <Button variant="primary">
            Update Requested Leave
          </Button>
        </Link>
        <div style={{ float: 'right' }}>
          <Button>
            <input type="date" id="startDate" onChange={myFunction} />
          </Button>
          <Button>
            <input type="date" id="endDate" onChange={myFunction} />
          </Button>
        </div>
        <select className="form-select form-select mb-3" aria-label=".form-select-lg example"
          id="statusDropDown" onChange={handleInputChange}>
          <option selected value="">Select Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Apply Leave</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ date: '', type: '', leave_day_type: '', reason: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form>
                  {errors.api && <p className="text-danger">{errors.api}</p>}
                  <InputField
                    label="Date"
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Date"
                    isInvalid={touched.date && !!errors.date}
                    error={errors.date}
                  />
                  <SelectField
                    label="Leave Type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={leaveChoices}
                    isInvalid={touched.type && !!errors.type}
                    error={errors.type}
                  />
                  <SelectField
                    label="Leave Day Type"
                    name="leave_day_type"
                    value={values.leave_day_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={leaveDayTypes}
                    isInvalid={touched.leave_day_type && !!errors.leave_day_type}
                    error={errors.leave_day_type}
                  />
                  <InputField
                    label="Reason"
                    type="text"
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Reason"
                    isInvalid={touched.reason && !!errors.reason}
                    error={errors.reason}
                  />
                  <Button variant="primary" type="submit" disabled={isSubmitting} >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Leave Day Type</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((data, index) => (
              <tr key={index}>
                <td>{data.date}</td>
                <td>{data.type}</td>
                <td>{data.status}</td>
                <td>{data.reason}</td>
                <td>{data.leave_day_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Leaves;
