import React from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Home() {
  let navigate = useNavigate();

  const [meetingCode, setMeetingCode] = React.useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };
  
  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Video Call</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p style={{ marginLeft: "5px" }}>History</p>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            variant="outlined"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <h2>Providing Quality Video Call</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              label="Enter Meeting Code"
              variant="outlined"
            />
            <Button
              onClick={handleJoinVideoCall}
              variant="contained"
              style={{ height: "55px" }}
            >
              Join
            </Button>
          </div>
        </div>

        <div className="rightPanel">
          <img
            src="/logo3.png"
            alt="video call illustration"
            className="illustrationImage"
          />
        </div>
      </div>
    </>
  );
}

export default withAuth(Home);
