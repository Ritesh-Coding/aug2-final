import React from 'react'
import { useDispatch } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
const Hotline = () => {
  const dispatch = useDispatch();
  dispatch( navbarTitle({navTitle: "Hotline"}));
  return (
    <div>Hotline</div>
  )
}

export default Hotline