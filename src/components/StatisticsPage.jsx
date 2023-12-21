
import React, { useState, useEffect, useContext } from 'react';
import { db } from '../main'; 
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from "../context/AuthContext";
import { Grid, Card, CardContent, Typography, useTheme, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip } from '@mui/material';
import { Pie, Bar} from 'react-chartjs-2';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useSelector } from 'react-redux';
import { getRelativeTime } from '../helpers';
import 'chart.js/auto';

export const StatisticsPage = () => {

  const jobs = useSelector(state => state.jobs);

  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [jobsInterviewing, setJobsInterviewing] = useState(0);
  const [jobsOffered, setJobsOffered] = useState(0);
  const [jobsRejected, setJobsRejected] = useState(0);
  const [jobsGhosted, setJobsGhosted] = useState(0);
  const [latestJobs, setLatestJobs] = useState([]);
  const { currentUser } = useContext(AuthContext);


  const theme = useTheme();
  useEffect(() => {


    if(jobs.length == 0){
      const fetchData = async () => {
        const userid = currentUser.uid;
        
        const docRef = doc(db, 'dashboards', userid);
  
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const jobs = data.jobs || [];
            
            setTotalJobs(jobs.filter(job => job.category === 'Wishlist').length);
            setJobsApplied(jobs.filter(job => job.category === 'Applied').length);
            setJobsInterviewing(jobs.filter(job => job.category === 'Interviewing').length);
            setJobsOffered(jobs.filter(job => job.category === 'Offer').length);
            setJobsRejected(jobs.filter(job => job.category === 'Rejected').length);
            setJobsGhosted(jobs.filter(job => job.category === 'Ghosted').length);
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
  
  
      };

      const fetchLatestJobs = async () => {
        const userid = currentUser.uid;
        const docRef = doc(db, 'dashboards', userid);
  
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const jobs = data.jobs || [];
  
            const jobsWithDaysAgo = jobs.map(job => ({
              ...job,
              daysAgo: getRelativeTime(job.created_on),
            }));
  
            const sortedJobs = jobsWithDaysAgo.sort((a, b) => b.created_on - a.created_on).slice(0, 10);
  
            setLatestJobs(sortedJobs);
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
      };

      fetchData();
      fetchLatestJobs();
    }else{
      setTotalJobs(jobs.filter(job => job.category === 'Wishlist').length);
      setJobsApplied(jobs.filter(job => job.category === 'Applied').length);
      setJobsInterviewing(jobs.filter(job => job.category === 'Interviewing').length);
      setJobsOffered(jobs.filter(job => job.category === 'Offer').length);
      setJobsRejected(jobs.filter(job => job.category === 'Rejected').length);
      setJobsGhosted(jobs.filter(job => job.category === 'Ghosted').length);

      const jobsWithDaysAgo = jobs.map(job => ({
        ...job,
        daysAgo: getRelativeTime(job.created_on),
      }));

      const sortedJobs = jobsWithDaysAgo.sort((a, b) => b.created_on - a.created_on).slice(0, 10);

      setLatestJobs(sortedJobs);
    }




  }, [jobs]);

  const cardColors = {
    total: theme.palette.primary.main,
    applied: theme.palette.warning.main,
    interviewing: theme.palette.info.main,
    offered: theme.palette.success.main,
    rejected: theme.palette.error.main,
    ghosted: theme.palette.grey[600],
  };

  const total = totalJobs + jobsApplied + jobsInterviewing + jobsOffered + jobsRejected + jobsGhosted;
  const calculatePercentage = (value) => ((value / total) * 100).toFixed(2);

  const jobStats = [
    { label: 'WishList', value: totalJobs, color: cardColors.total },
    { label: 'Applied', value: jobsApplied, color: cardColors.applied },
    { label: 'Interviewing', value: jobsInterviewing, color: cardColors.interviewing },
    { label: 'Offered', value: jobsOffered, color: cardColors.offered },
    { label: 'Rejected', value: jobsRejected, color: cardColors.rejected },
    { label: 'Ghosted', value: jobsGhosted, color: cardColors.ghosted },
  ].map((stat) => ({
    ...stat,
    percentageLabel: `${stat.label} - ${calculatePercentage(stat.value)}%` 
  }));


  const data = {
    labels: jobStats.map((stat) => stat.label),
    datasets: [{
      label: 'Job Status',
      data: jobStats.map((stat) => stat.value),
      backgroundColor: [
        cardColors.total,
        cardColors.applied,
        cardColors.interviewing,
        cardColors.offered,
        cardColors.rejected,
        cardColors.ghosted,
      ],
      hoverOffset: 4,
      borderWidth: 0,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += `${context.parsed}%`;
            }
            return label;
          }
        }
      }
    },
  };

  const barData = {
    labels: jobStats.map(stat => stat.label),
    datasets: [
      {
        label: 'Jobs by list',
        data: jobStats.map(stat => stat.value),
        backgroundColor: jobStats.map(stat => theme.palette.primary.main), 
      }
    ]
  };

  const barOptions = {
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top', 
      },
      title: {
        display: true,
        text: 'Jobs by list'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Job Status'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Jobs'
        }
      }
    }
  };
  

  return (
    <Grid container spacing={2}>
      {jobStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: stat.color, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1"  component="div" sx={{ color: 'white' }}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

 
      <Grid item container xs={12} spacing={2}>
            
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Status Breakdown
                    </Typography>
                    <div style={{ height: '300px' }}> 
                      <Pie data={data} options={options} />
                    </div>
                  </CardContent>
                </Card>
              </Grid>

    
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Jobs by List
              </Typography>
              <div style={{ height: '300px' }}> 
                <Bar data={barData} options={barOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Latest Jobs
          </Typography>
          <List>
            {latestJobs.length > 0 ? (
              latestJobs.map((job, index) => (
                <ListItem key={index} button>
                  <ListItemAvatar>
                    <Avatar>
                      <BusinessCenterIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${job.company} - ${job.position}`}
                    secondary={`${job.jobType} - ${job.daysAgo}`}
                  />
                  <Chip label={job.category} color="primary" />
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">No recent jobs to display.</Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>
          </Grid>

  );
};
