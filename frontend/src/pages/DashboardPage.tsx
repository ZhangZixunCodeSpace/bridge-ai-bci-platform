/**
 * Bridge AI+BCI Platform - User Dashboard Component
 * Comprehensive personal training data visualization and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Brain, TrendingUp, Target, Calendar, Award, Settings,
  User, Clock, Zap, Heart, Eye, Sparkles, Star, Trophy,
  ChevronRight, Download, Share2, RefreshCw, Filter
} from 'lucide-react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile and dashboard data
      const [profileResponse, statsResponse] = await Promise.all([
        fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        fetch(`/api/users/dashboard-stats?period=${selectedPeriod}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
      ]);

      const userData = await profileResponse.json();
      const statsData = await statsResponse.json();

      if (userData.success) setUser(userData.data.user);
      if (statsData.success) setDashboardData(statsData.data);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard Unavailable</h2>
          <p className="text-slate-400">Unable to load your training data. Please try again.</p>
          <button
            onClick={handleDataRefresh}
            className="mt-4 px-6 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Neural Dashboard</h1>
                <p className="text-slate-400">Welcome back, {user.profile?.firstName || user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="1y">Last Year</option>
              </select>
              
              <button
                onClick={handleDataRefresh}
                className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-8 border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'progress', label: 'Progress', icon: Target },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab
              user={user}
              data={dashboardData}
              period={selectedPeriod}
            />
          )}
          {activeTab === 'progress' && (
            <ProgressTab
              user={user}
              data={dashboardData}
              period={selectedPeriod}
            />
          )}
          {activeTab === 'sessions' && (
            <SessionsTab
              user={user}
              data={dashboardData}
              period={selectedPeriod}
            />
          )}
          {activeTab === 'achievements' && (
            <AchievementsTab
              user={user}
              data={dashboardData}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user, data, period }) => {
  const skillColors = {
    stressManagement: '#ef4444',
    empathyTraining: '#10b981',
    conflictResolution: '#8b5cf6',
    emotionalRegulation: '#f59e0b',
    activeListening: '#06b6d4'
  };

  const pieData = Object.entries(user.bciProfile.skillLevels).map(([skill, level]) => ({
    name: skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: level,
    color: skillColors[skill] || '#64748b'
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Brain}
          title="Total Sessions"
          value={user.bciProfile.stats.totalSessions}
          change={data.sessionGrowth}
          color="amber"
        />
        <MetricCard
          icon={Clock}
          title="Training Time"
          value={`${Math.floor(user.bciProfile.stats.totalTrainingTime / 60)}h ${user.bciProfile.stats.totalTrainingTime % 60}m`}
          change={data.timeGrowth}
          color="blue"
        />
        <MetricCard
          icon={TrendingUp}
          title="Current Streak"
          value={`${user.bciProfile.stats.currentStreak} days`}
          change={data.streakChange}
          color="green"
        />
        <MetricCard
          icon={Zap}
          title="Avg Improvement"
          value={`${Math.round((user.bciProfile.stats.averageStressReduction + user.bciProfile.stats.averageEmpathyImprovement) / 2)}%`}
          change={data.improvementTrend}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BCI Metrics Trend */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-amber-500" />
            BCI Metrics Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.bciTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="empathy" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="regulation" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-amber-500" />
            Skill Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-amber-500" />
          Recent Training Sessions
        </h3>
        <div className="space-y-4">
          {data.recentSessions.map((session, index) => (
            <RecentSessionCard key={index} session={session} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Progress Tab Component
const ProgressTab = ({ user, data, period }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* BCI Baseline */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Brain className="w-6 h-6 mr-3 text-amber-500" />
          Neural Baseline Status
        </h3>
        
        {user.bciProfile.baseline.calibratedAt ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaselineMetric
              label="Stress Baseline"
              value={user.bciProfile.baseline.stress}
              quality={user.bciProfile.baseline.calibrationQuality}
              color="red"
            />
            <BaselineMetric
              label="Focus Baseline"
              value={user.bciProfile.baseline.focus}
              quality={user.bciProfile.baseline.calibrationQuality}
              color="blue"
            />
            <BaselineMetric
              label="Empathy Baseline"
              value={user.bciProfile.baseline.empathy}
              quality={user.bciProfile.baseline.calibrationQuality}
              color="green"
            />
            <BaselineMetric
              label="Regulation Baseline"
              value={user.bciProfile.baseline.regulation}
              quality={user.bciProfile.baseline.calibrationQuality}
              color="purple"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Neural Calibration Needed</h4>
            <p className="text-slate-400 mb-4">Complete your BCI calibration to establish your neural baseline</p>
            <button className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
              Start Calibration
            </button>
          </div>
        )}
      </div>

      {/* Skill Progress */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-amber-500" />
          Skill Development Progress
        </h3>
        
        <div className="space-y-6">
          {Object.entries(user.bciProfile.skillLevels).map(([skill, level]) => (
            <SkillProgressBar
              key={skill}
              skill={skill}
              level={level}
              improvement={data.skillImprovements?.[skill] || 0}
            />
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-amber-500" />
          Performance Analytics
        </h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data.performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="stressReduction"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="empathyIncrease"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Sessions Tab Component
const SessionsTab = ({ user, data, period }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-amber-500" />
            <span className="text-sm text-slate-400">This {period}</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.sessionStats.thisPeriod}</div>
          <div className="text-sm text-slate-400">Training Sessions</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-slate-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.sessionStats.averageDuration}m</div>
          <div className="text-sm text-slate-400">Session Duration</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-sm text-slate-400">Completion</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.sessionStats.completionRate}%</div>
          <div className="text-sm text-slate-400">Success Rate</div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-amber-500" />
          Session History
        </h3>
        
        <div className="space-y-4">
          {data.sessionHistory.map((session, index) => (
            <SessionHistoryCard key={index} session={session} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Achievements Tab Component
const AchievementsTab = ({ user, data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Achievement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
          <Trophy className="w-12 h-12 text-amber-500 mb-4" />
          <div className="text-2xl font-bold text-white">{user.bciProfile.achievements.length}</div>
          <div className="text-sm text-amber-200">Total Achievements</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl p-6 border border-yellow-500/30">
          <Star className="w-12 h-12 text-yellow-500 mb-4" />
          <div className="text-2xl font-bold text-white">
            {user.bciProfile.achievements.filter(a => a.level === 'gold').length}
          </div>
          <div className="text-sm text-yellow-200">Gold Achievements</div>
        </div>

        <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-2xl p-6 border border-gray-400/30">
          <Award className="w-12 h-12 text-gray-400 mb-4" />
          <div className="text-2xl font-bold text-white">
            {user.bciProfile.achievements.filter(a => a.level === 'silver').length}
          </div>
          <div className="text-sm text-gray-300">Silver Achievements</div>
        </div>

        <div className="bg-gradient-to-br from-amber-700/20 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30">
          <Sparkles className="w-12 h-12 text-amber-700 mb-4" />
          <div className="text-2xl font-bold text-white">
            {user.bciProfile.achievements.filter(a => a.level === 'bronze').length}
          </div>
          <div className="text-sm text-amber-300">Bronze Achievements</div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.bciProfile.achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </div>
    </motion.div>
  );
};

// Helper Components

const MetricCard = ({ icon: Icon, title, value, change, color }) => {
  const colorClasses = {
    amber: 'text-amber-500 bg-amber-500/20 border-amber-500/30',
    blue: 'text-blue-500 bg-blue-500/20 border-blue-500/30',
    green: 'text-green-500 bg-green-500/20 border-green-500/30',
    purple: 'text-purple-500 bg-purple-500/20 border-purple-500/30'
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-6 border backdrop-blur-xl`}>
      <Icon className={`w-8 h-8 mb-4`} />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
      {change && (
        <div className={`text-xs mt-2 flex items-center ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {change > 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
};

const BaselineMetric = ({ label, value, quality, color }) => {
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-xl p-4">
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`text-xs ${getQualityColor(quality)} capitalize`}>
        {quality} Quality
      </div>
    </div>
  );
};

const SkillProgressBar = ({ skill, level, improvement }) => {
  const skillName = skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{skillName}</span>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">{level}%</span>
          {improvement > 0 && (
            <span className="text-green-400 text-sm">+{improvement}%</span>
          )}
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <motion.div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const RecentSessionCard = ({ session }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <div className="text-white font-medium">{session.scenario} Training</div>
          <div className="text-slate-400 text-sm">{session.date} • {session.duration}m</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-green-400 font-medium">+{session.improvement}%</div>
        <div className="text-slate-400 text-sm">Improvement</div>
      </div>
    </div>
  );
};

const SessionHistoryCard = ({ session }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${session.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <div>
          <div className="text-white font-medium">{session.type}</div>
          <div className="text-slate-400 text-sm">{session.date}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-slate-300">{session.duration}m</div>
        <div className="text-green-400">+{session.score}%</div>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement }) => {
  const levelColors = {
    bronze: 'from-amber-700 to-amber-800 border-amber-700',
    silver: 'from-gray-400 to-gray-500 border-gray-400',
    gold: 'from-yellow-500 to-amber-500 border-yellow-500',
    platinum: 'from-purple-500 to-indigo-500 border-purple-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${levelColors[achievement.level]} rounded-2xl p-6 border backdrop-blur-xl`}
    >
      <Trophy className="w-8 h-8 mb-4" />
      <h4 className="text-lg font-bold text-white mb-2">{achievement.title}</h4>
      <p className="text-sm opacity-80 mb-4">{achievement.description}</p>
      <div className="text-xs opacity-60">
        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
};

export default UserDashboard;
