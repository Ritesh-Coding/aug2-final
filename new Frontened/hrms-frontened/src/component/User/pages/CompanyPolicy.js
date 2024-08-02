import React from 'react'
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux'
const CompanyPolicy = () => {
  const dispatch = useDispatch()
  dispatch(
    navbarTitle({
        navTitle: "Company Policy"}));
  return (
    <div>CompanyPolicy</div>
  )
}

export default CompanyPolicy