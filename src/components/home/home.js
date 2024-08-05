import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../loading/loading";
import "./home.css";
import ThreatDetectionChart from "../charts/threatDetection";
import IncidentReportsChart from "../charts/incidenReport";
import VulnerabilityScansChart from "../charts/vulnerabilityscan";
import UserActivityChart from "../charts/userActivity";
import { apiGet } from "../services/service";
import CustomSnackbar from "../snackbar/snackbar";

function Home() {
  const [data, setData] = useState(null);
  const [chart, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    if (userid && token) {
      fetchData(userid);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (userid) => {
    try {
      setLoading(true);
      let param = { userid: userid };
      const chartsres = await apiGet("get-chart", param);
      if (chartsres && chartsres.data.length > 0) {
        setChartData(chartsres.data[0]);
      } else {
        setChartData({});
      }

      const response = await apiGet("get-reseller", param);
      if (response && response.reseller) {
        setData(response.reseller);
      } else {
        setData(null);
      }
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "An error occurred",
        severity: "error",
      });
      navigate("/login")
    } finally {
      setLoading(false);
    }
  };
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <div className="home">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <nav className="navbar">
            <ul className="nav-links">
              <li>
                <img src={data?.logoUrl} alt="Loading..." />
              </li>
              <li>
                <span>{data?.name}</span>
              </li>
              <li>
                <span>{data?.email}</span>
              </li>
              <li>
                <Link to={data?.website}>website</Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <h1>Welcome to {data?.headline}!</h1>
            <h3>{data?.tagline}</h3>
            <img
              src={data?.brandimg}
              alt="Loading..."
              width={200}
              height={200}
            />
            <p>{data?.bodytext}</p>
            <div className="charts">
              <div className="chart-container">
                {chart?.ThreatDetectionChart ? (
                  <ThreatDetectionChart data={chart.ThreatDetectionChart} />
                ) : (
                  <p>No Threat Detection data available</p>
                )}
              </div>
              <div className="chart-container">
                {chart?.IncidentReportsChart ? (
                  <IncidentReportsChart data={chart.IncidentReportsChart} />
                ) : (
                  <p>No Incident Reports data available</p>
                )}
              </div>
              <div className="chart-container">
                {chart?.VulnerabilityScansChart ? (
                  <VulnerabilityScansChart
                    data={chart.VulnerabilityScansChart}
                  />
                ) : (
                  <p>No Vulnerability Scans data available</p>
                )}
              </div>
              <div className="chart-container">
                {chart?.UserActivityChart ? (
                  <UserActivityChart data={chart.UserActivityChart} />
                ) : (
                  <p>No User Activity data available</p>
                )}
              </div>
            </div>
          </div>
          <CustomSnackbar
            open={snackbar.open}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
