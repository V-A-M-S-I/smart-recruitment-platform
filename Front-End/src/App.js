import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/login";
import Signup from "./components/signup";
import ForgotPassword from './components/forgetpassword';
import ResetPassword from './components/resetpassword.js';
import Home from './userpages.js/home.js';
import Jobcreation from './AdminComponents/jobcreation.js';
import JobList from './AdminComponents/jobslist.js';
import ViewJobDetails from './AdminComponents/viewjobdetails.js'; // Check this line
import Newjobs from './components/newjobs.js';
import Jobdetails from './components/jobdetails.js';
import ApplicationForm from './components/applicationform.js';
import Main from './components/main.js';
import Adminogin from './AdminComponents/adminlogin.js';
import ApplicantsList from './AdminComponents/applicantsData.js';
import Feedback from './AdminComponents/feedback.js';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobcreation" element={<Jobcreation />} />
          <Route path="/jobslist" element={<JobList />} />
          <Route path="/editjob/:id" element={<Jobcreation />} />
          <Route path="/viewjobdetails/:id" element={<ViewJobDetails />} />
          <Route path="/newjobs/" element={<Newjobs/>}/>
          <Route path="/jobdetails/:id" element={<Jobdetails/>}/>
          <Route path="/applyjob/:id" element={<ApplicationForm/>}/>
          <Route path='/' element={<Main/>}/>
          <Route path='/adminlogin' element={<Adminogin />}/>
          <Route path="/applicants/:id" element={<ApplicantsList />} />
          <Route path='/applicants/feedback/:id' element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
