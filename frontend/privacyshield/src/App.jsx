import { Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import Assesment from "./components/Assesment"
import Report from "./components/Report"
import Navbar from './components/Navbar'
import HeroSection from "./components/HeroSection";
import InfoCards from "./components/InfoCards";

function App() {

  return (
    <>
      <Navbar />
      <HeroSection />
      <InfoCards />
      <br></br><br></br><br></br><br></br>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/assesment" element={<Assesment />} />
        <Route exact path="/report" element={<Report />} />
      </Routes>
    </>
  )
}

export default App
