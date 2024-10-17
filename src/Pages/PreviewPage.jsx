import React from 'react';
import TitleBox from '../Components/Forms/TitleBox';
import Subform from './Subform';
import { Button } from "@mui/material";
import Navbar from '../Components/Common/Navbar';
import { useLocation, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const location = useLocation();
  const handleSubmit = () => {
    console.log('Form submitted');
    alert("Data Submitted to server")
    localStorage.clear();
    const exitpreview =window.open("/user-form", '_self');
    exitpreview.focus();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        {/* <TitleBox /> */}
        <Subform />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

export default PreviewPage;
