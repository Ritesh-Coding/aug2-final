import React from 'react'
import { useDispatch } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
import Chat from '../UI/Chat';
const Sensation = () => {
  const dispatch = useDispatch();
  dispatch( navbarTitle({navTitle: "Sensation"}));
  return (
    <div style={{marginLeft : `256px`}}>
    <Chat />
    </div>
   
  )
}

export default Sensation