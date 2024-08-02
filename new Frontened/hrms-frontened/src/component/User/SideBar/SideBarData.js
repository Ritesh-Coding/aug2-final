import React from 'react';
import * as FaIcons from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { MdOutlinePolicy } from "react-icons/md";

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    
  },
  {
    title: 'Hotline',
    path: '/hotline',
    icon: <FaIcons.FaPersonBooth />,
    

    
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: <FaIcons.FaRegClock />
  },
  {
    title: 'Leaves',
    path: '/leaves',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Expense Claims',
    path: '/claims',
    icon: <FaIcons.FaCalculator />
  },
  {
    title: 'Company Policy',
    path: '/companyPolicy',
    icon: <MdOutlinePolicy />,

  
  },
  {
    title: 'Committee',
    path: '/committee',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Sensation',
    path: '/sensation',
    icon: <FaIcons.FaNoteSticky />
  }
];