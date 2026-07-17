import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";


function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profilePicture: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(res.data.profile);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };

  const handleSave = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        "/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully!");

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };



return (
  <div className="profile-page-fullscreen">
    
    {/* Return Button */}
    <Link to="/dashboard" className="back-dashboard-btn">
      <span className="back-arrow">←</span> Return to Dashboard
    </Link>

    {/* Section Header */}
    <div className="profile-header">
      <h1>Account Settings</h1>
      <p>Manage your personal reflection preferences and identity tokens.</p>
    </div>

    <div className="profile-workspace-layout">
      
      {/* LEFT COLUMN: Identity Card */}
      <aside className="profile-identity-sidebar">
        <div className="avatar-upload-container">
          <div className="avatar-circle-preview">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile Card" />
            ) : (
              <span className="avatar-initial-fallback">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
              </span>
            )}
          </div>
          <button className="avatar-action-trigger-btn" type="button">
            Change Photo
          </button>
        </div>

        <div className="identity-meta-info">
          <h3>{profile.name || "Reflective Soul"}</h3>
          <p>{profile.email}</p>
        </div>

        {/* Global Save Trigger docked below identity summary */}
        <button
          className="save-profile-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Syncing..." : "Save Account Details ✨"}
        </button>
      </aside>

      {/* RIGHT COLUMN: Form & Upgraded Feature Sections */}
      <main className="profile-details-pane">
        
        {/* Core Profile Card */}
        <div className="profile-content-card">
          <h2>Personal Information</h2>
          <div className="profile-fields-grid">
            
            <div className="input-group-custom">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                placeholder="Your preferred name"
              />
            </div>

            <div className="input-group-custom field-disabled">
              <label>Email Address</label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
              />
            </div>

            <div className="input-group-custom">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Add contact number"
              />
            </div>

            

            <div className="input-group-custom full-row">
              <label>Gender Identity</label>
              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select Identity</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

          </div>
        </div>

        {/* Upgraded Feature Roadmap Blocks */}
        <div className="profile-addons-row-grid">
          
          <div className="profile-content-card feature-placeholder-card">
            <div className="card-placeholder-badge">🚨 Upcoming</div>
            <h3>Emergency Contacts</h3>
            <p className="placeholder-description">
              Securely store rapid-access contacts to notify during heightened anxiety responses or clinical crises.
            </p>
          </div>

          <div className="profile-content-card feature-placeholder-card">
            <div className="card-placeholder-badge-green">🎵 Preferences</div>
            <h3>Custom Atmosphere</h3>
            <div className="mini-tag-stream">
              <span className="profile-placeholder-tag">🌸 Lo-fi Audio</span>
              <span className="profile-placeholder-tag">🌱 Hobbies</span>
              <span className="profile-placeholder-tag">🫁 Breath Pacing</span>
            </div>
          </div>

          <div className="profile-content-card feature-placeholder-card full-row">
            <div className="card-placeholder-badge">🧠 Health</div>
            <h3>Medical Identity Dossier</h3>
            <p className="placeholder-description">
              A private log to document your trusted therapists, psychiatrists, and active prescriptions for reference.
            </p>
            <div className="mini-tag-stream">
              <span className="profile-placeholder-tag">💊 Medications</span>
              <span className="profile-placeholder-tag">👨‍⚕️ Care Network</span>
            </div>
          </div>

        </div>

      </main>

    </div>
  </div>
);

}

export default Profile;