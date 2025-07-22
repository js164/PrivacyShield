import { Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import Assesment from "./components/Assesment"
import Report from "./components/Report"

function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/assesment" element={<Assesment />} />
        <Route exact path="/report" element={<Report />} />
      </Routes>
    </>
  )
}

export default App
