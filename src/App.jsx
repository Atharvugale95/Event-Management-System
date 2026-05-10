import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import Success from "./components/Success";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./components/dashboards/AdminDashboard";
import OrganizerDashboard from "./components/dashboards/OrganizerDashboard";
import GuestDashboard from "./components/dashboards/GuestDashboard";

import EventList from "./components/events/EventList";
import EventForm from "./components/events/EventForm";
import EventRegister from "./components/events/EventRegister";

import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-register" element={<RegisterUser />} />
        <Route path="/success" element={<Success />} />

        {/* Dashboards */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/organizer" element={<ProtectedRoute role="organizer"><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/guest" element={<ProtectedRoute role="guest"><GuestDashboard /></ProtectedRoute>} />

        {/* Event routes */}
        <Route path="/events" element={
          <ProtectedRoute>
            <EventList />
          </ProtectedRoute>
        }/>
        <Route path="/events/create" element={
         <ProtectedRoute roles={["admin", "organizer"]}>
            <EventForm />
          </ProtectedRoute>
        }/>
        <Route path="/events/:id/edit" element={
          <ProtectedRoute roles={["admin", "organizer"]}>
            <EventForm />
          </ProtectedRoute>
        }/>
        <Route path="/events/:id/register" element={
          <ProtectedRoute role="guest">
            <EventRegister />
          </ProtectedRoute>
        }/>
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;