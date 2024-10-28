import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Timeline,
  BarChart,
  School,
  Assignment,
  MoreVert,
  TrendingUp,
  AccessTime,
  Group,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Dados fictícios para os gráficos
  const progressData = [
    { name: 'Jan', progress: 65 },
    { name: 'Fev', progress: 72 },
    { name: 'Mar', progress: 68 },
    { name: 'Abr', progress: 80 },
    { name: 'Mai', progress: 85 },
    { name: 'Jun', progress: 78 },
  ];

  const disciplineData = [
    { name: 'Programação', value: 35 },
    { name: 'Matemática', value: 25 },
    { name: 'Física', value: 20 },
    { name: 'Química', value: 20 },
  ];

  const COLORS = ['#5865F2', '#43b581', '#f04747', '#faa61a'];

  const recentActivities = [
    { id: 1, title: 'Completou sessão de Programação', time: '2h atrás', type: 'completion' },
    { id: 2, title: 'Iniciou novo módulo de Matemática', time: '5h atrás', type: 'start' },
    { id: 3, title: 'Enviou trabalho de Física', time: '1d atrás', type: 'submission' },
  ];

  const statistics = [
    {
      title: 'Sessões Completadas',
      value: '24',
      icon: <CheckCircle sx={{ fontSize: 40, color: '#43b581' }} />,
      change: '+12%',
    },
    {
      title: 'Horas Estudadas',
      value: '156h',
      icon: <AccessTime sx={{ fontSize: 40, color: '#faa61a' }} />,
      change: '+8%',
    },
    {
      title: 'Média de Progresso',
      value: '78%',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#5865F2' }} />,
      change: '+5%',
    },
    {
      title: 'Participação em Grupo',
      value: '12',
      icon: <Group sx={{ fontSize: 40, color: '#f04747' }} />,
      change: '+15%',
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Box className="dashboard-header">
          <Typography variant="h4" className="dashboard-title">
            Dashboard
          </Typography>
          <Box className="dashboard-actions">
            <Button
              variant="contained"
              startIcon={<Assignment />}
              className="report-button"
            >
              Gerar Relatório
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Cards de Estatísticas */}
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="stat-card">
                <CardContent>
                  <Box className="stat-content">
                    <Box className="stat-info">
                      <Typography variant="h6" className="stat-title">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" className="stat-value">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" className="stat-change">
                        {stat.change} este mês
                      </Typography>
                    </Box>
                    <Box className="stat-icon">
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Gráfico de Progresso */}
          <Grid item xs={12} md={8}>
            <Card className="chart-card">
              <CardContent>
                <Box className="chart-header">
                  <Typography variant="h6">
                    Progresso ao Longo do Tempo
                  </Typography>
                  <IconButton onClick={handleClick}>
                    <MoreVert />
                  </IconButton>
                </Box>
                <Box className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="progress" stroke="#5865F2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Distribuição por Disciplina */}
          <Grid item xs={12} md={4}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribuição por Disciplina
                </Typography>
                <Box className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={disciplineData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {disciplineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box className="chart-legend">
                  {disciplineData.map((entry, index) => (
                    <Box key={entry.name} className="legend-item">
                      <Box
                        className="legend-color"
                        sx={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <Typography variant="body2">{entry.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {entry.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Atividades Recentes */}
          <Grid item xs={12}>
            <Card className="activities-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Atividades Recentes
                </Typography>
                <Box className="activities-list">
                  {recentActivities.map((activity) => (
                    <Box key={activity.id} className="activity-item">
                      <Box className="activity-icon">
                        {activity.type === 'completion' && <CheckCircle color="success" />}
                        {activity.type === 'start' && <Timeline color="primary" />}
                        {activity.type === 'submission' && <Assignment color="warning" />}
                      </Box>
                      <Box className="activity-content">
                        <Typography variant="body1">{activity.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className="chart-menu"
        >
          <MenuItem onClick={handleClose}>Últimos 7 dias</MenuItem>
          <MenuItem onClick={handleClose}>Último mês</MenuItem>
          <MenuItem onClick={handleClose}>Último trimestre</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Dashboard;