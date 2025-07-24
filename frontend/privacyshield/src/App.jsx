import { Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import Assesment from "./components/Assesment"
import Report from "./components/Report"
import AdminDashboard from "./components/AdminDashboard"
import axios from 'axios';

function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/assesment" element={<Assesment />} />
        <Route exact path="/report" element={<Report />} />
        <Route exact path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

axios.interceptors.request.use(function (config) {
  if(config.url.slice(0,4)!=='http'){
    config.url = 'http://localhost:8000' + config.url
  }
  // const token = localStorage.getItem('access_token');
  // config.headers.Authorization = 'Bearer ' + token;
  return config;
});



export default App
