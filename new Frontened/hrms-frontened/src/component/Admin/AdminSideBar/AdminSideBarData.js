import React from 'react';
import * as FaIcons from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { MdOutlinePolicy } from "react-icons/md";

export const AdminSidebarData = [
  
  {
    title: 'Employee',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,    
  },  
  {
    title: 'Attendance',
    path: '/dashboard/attendance',
    icon: <FaIcons.FaRegClock />
  },
  {
    title: 'Leaves',
    path: '/dashboard/leaves',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Holidays',
    path: '/dashboard/holidays',
    icon: <FaIcons.FaCalculator />
  },
  {
    title: 'Company Policy',
    path: '/dashboard/companyPolicy',
    icon: <MdOutlinePolicy />,
  
  },
  {
    title: 'Committee',
    path: '/dashboard/committee',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Sensation',
    path: '/dashboard/sensation',
    icon: <FaIcons.FaNoteSticky />
  }
];