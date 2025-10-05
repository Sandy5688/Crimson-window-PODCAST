import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';  // Relative from pages/
import api from '../utils/api';  // Relative from pages/ to utils/

function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { feedUpdates } = useSocket();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Parallel fetches for Repo A endpoints
        const [statsRes, activityRes, metricsRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/dashboard/recent-activity'),
          api.get('/api/dashboard/metrics-history')
        ]);
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
        setMetricsHistory(metricsRes.data);
      } catch (error) {
        console.warn('Dashboard fetch warning (non-fatal):', error);  // Softer log
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (feedUpdates.length > 0) {
      // Refresh data on Socket update (re-fetch or append as needed)
      console.log('Dashboard updated via Socket:', feedUpdates);
      // TODO: Trigger refetch here when Socket matures
    }
  }, [feedUpdates]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Podcast Dashboard</h2>
      <Link to="/autoupload">Go to Auto Upload</Link>

      {/* Stats Overview */}
      <div style={{ margin: '20px 0' }}>
        <h3>Stats</h3>
        <p>Total Channels: {stats.totalChannels || 0}</p>
        <p>Active Feeds: {stats.activeFeeds || 0}</p>
        <p>Avg Status: {stats.avgStatus || 0}%</p>
      </div>

      {/* Recent Activity */}
      <div style={{ margin: '20px 0' }}>
        <h3>Recent Activity</h3>
        <ul>
          {recentActivity.map((activity) => (
            <li key={activity.id || activity.timestamp || Math.random()}>  {/* Fallback key */}
              {activity.action} - {activity.timestamp}
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics History Chart */}
      <div style={{ margin: '20px 0' }}>
        <h3>Metrics History</h3>
        <p>Chart Placeholder (Embed Chart.js below when ready)</p>
        ```chartjs
        {
          "type": "line",
          "data": {
            "labels": [
              ${metricsHistory.map(m => `"${m.date}"`).join(', ')}
            ],
            "datasets": [{
              "label": "Status %",
              "data": [${metricsHistory.map(m => m.value).join(', ')}],
              "borderColor": "rgb(75, 192, 192)",
              "backgroundColor": "rgba(75, 192, 192, 0.2)",
              "tension": 0.1
            }]
          },
          "options": {
            "responsive": true,
            "scales": {
              "y": {
                "beginAtZero": true
              }
            }
          }
        }
        ```
        {/* TODO: Replace with <Line data={chartData} /> from react-chartjs-2 when deps added */}
      </div>
    </div>
  );
}

export default Dashboard;
