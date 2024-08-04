import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import useAxios from '../../../hooks/useAxios';
// import { DateRangePicker, RangeKeyDict, Range } from 'react-date-range';
import {DateRangePicker,RangeKeyDict,Range} from 'react-date-range'
import { addDays } from 'date-fns';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { navbarTitle } from '../../../reducers/authReducer';
import { Pagination } from '../../../hooks/usePaginationRange';
import "./page.css"

interface AttenDanceDataType {
    total_present_days: number;
    total_late_days: number;
    total_half_days: number;
    net_working_hours: string;
    total_office_hours: string;
    total_break_hours: string;
    entry_time: string;
    exit_time: string;
    date: string;
}

const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
};

const formatTime = (timeString: string) => {
    if (!timeString || timeString === "-") return "-";
    return timeString.substring(0, 5);
};

const getDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Attendance: React.FC = () => {
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const dispatch = useDispatch();
    dispatch(navbarTitle({ navTitle: "Attendance" }));

    const [attendanceData, setAttendanceData] = useState<AttenDanceDataType[]>([]);
    const [isCalender, setIsCalender] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const rowsPerPage = 5;

    const [myDate, setMyDate] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const axiosInstance = useAxios();

    const handleCalenderOpen = () => {
        setIsCalender(!isCalender);
    };

    const fetchAttenDanceData = (myDate: Range[], isCalender: boolean, page: number) => {
        const formattedStartDate = getDate(myDate[0].startDate!.toString());    
        const formattedEndDate = getDate(myDate[0].endDate!.toString());
        let start_date = ""
        let end_date = ""
        if (isCalender) {
            start_date = formattedStartDate
            end_date = formattedEndDate
        }
        axiosInstance.get(`attendanceReport/`, {
            params: {
                page,
                start_date,
                end_date
            }
        }).then((res) => {
            setAttendanceData(res.data["results"]);
            setTotalPages(Math.ceil(res.data.count / rowsPerPage));
        });
        setIsFetching(false)
    }

    useEffect(() => {
        fetchAttenDanceData(myDate, isCalender, currentPage)
    }, [myDate, isCalender, currentPage]);

    console.log("This is my attendance data", attendanceData)

    if (isFetching) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div style={{ marginLeft: "250px" }}>
            <div className='attendanceMainCard'>
                <div className="card bg-primary text-white infoAttendance">
                    <div className="card-body">Days
                        <div>{attendanceData.length > 0 && attendanceData[0].total_present_days}</div>
                    </div>
                </div>

                <div className="card bg-success text-white infoAttendance">
                    <div className="card-body">Total Office Hours
                        <div>{attendanceData.length > 0 && attendanceData[0].total_office_hours}</div></div>

                </div>

                <div className="card bg-info text-white infoAttendance">
                    <div className="card-body">Half Days
                        <div>{attendanceData.length > 0 && attendanceData[0].total_half_days}</div></div>
                </div>

                <div className="card bg-warning text-white infoAttendance">
                    <div className="card-body">Total Work Hours
                        <div>{attendanceData.length > 0 && formatTime(attendanceData[0].net_working_hours)}</div></div>
                </div>

                <div className="card bg-danger text-white infoAttendance">
                    <div className="card-body">Late
                        <div>{attendanceData.length > 0 && attendanceData[0].total_late_days}</div></div>
                </div>
            </div>
            {isCalender && (
                <DateRangePicker
                    onChange={(item: RangeKeyDict) => setMyDate([item.selection])}                   
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={myDate}
                    direction="horizontal"
                />
            )} 
            <Button onClick={handleCalenderOpen}>
                {isCalender ? "Close Calendar" : "Click here To Filter With Date"}
            </Button>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Entry Time</th>
                        <th scope="col">Exit Time</th>
                        <th scope="col">Break Time</th>
                        <th scope="col">Working Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.length > 0 ? (attendanceData.map((atten, index) => (
                        <tr key={index}>
                            <th scope="row">{atten.date}</th>
                            <td>{formatDate(atten.entry_time)}</td>
                            <td>{atten.exit_time && formatDate(atten.exit_time)}</td>
                            <td>{formatTime(atten.total_break_hours)}</td>
                            <td>{formatTime(atten.net_working_hours)}</td>
                        </tr>
                    ))) : (
                        <tr>
                            <td>No AttenDance data available</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default Attendance;
