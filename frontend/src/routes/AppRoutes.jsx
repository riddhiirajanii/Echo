import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import Assessment from "../pages/Assessment";
import Insights from "../pages/Insights";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import CalmSpace from "../pages/CalmSpace";
import BoxBreathing from "../components/Breathing/BoxBreathing";
import BreathingSpace from "../pages/BreathingSpace";
import BreathingCircle from "../components/Breathing/BreathingCircle";
import DeepBreathing from "../components/Breathing/DeepBreathing";
import FourSevenEight from "../components/Breathing/FourSevenEight";
import GroundingSpace from "../pages/GroundingSpace";
import SensoryScan from "../components/Grounding/SensoryScan";
import BodyScan from "../components/Grounding/MuscleScan";
import ObjectFocus from "../components/Grounding/ObjectFocus";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calmspace" element={<CalmSpace />} />
        <Route path="/breathing/boxbreathing" element={<BoxBreathing />} />
        <Route path="/breathingspace" element={<BreathingSpace />} />
        <Route path="/breathing/breathingcircle" element={<BreathingCircle />} />
        <Route path="/breathing/deep" element={<DeepBreathing />} />
        <Route path="/breathing/478" element={<FourSevenEight />} />
        <Route path="/grounding" element={<GroundingSpace />} />
        <Route path="/grounding/sensory-scan" element={<SensoryScan />} />
        <Route path="/grounding/muscle-scan" element={<BodyScan />} />
        <Route path="/grounding/object-focus" element={<ObjectFocus />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;