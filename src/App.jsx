import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import WelcomeBanner from './components/dashboard/WelcomeBanner';
import KpiCard from './components/dashboard/KpiCard';
import WeeklyActivityChart from './components/dashboard/WeeklyActivityChart';
import TopicMasterySection from './components/dashboard/TopicMasterySection';
import AiRecommendationCard from './components/dashboard/AiRecommendationCard';
import StudyPlanWidget from './components/dashboard/StudyPlanWidget';
import RecentActivityWidget from './components/dashboard/RecentActivityWidget';

import LearningMaterialsPage from './components/materials/LearningMaterialsPage';
import MyLearningPage from './components/mylearning/MyLearningPage';
import StudyPlannerPage from './components/planner/StudyPlannerPage';
import PracticeQuizzesPage from './components/practice/PracticeQuizzesPage';
import ProgressAnalyticsPage from './components/analytics/ProgressAnalyticsPage';
import AiTutorPage from './components/tutor/AiTutorPage';
import SettingsPage from './components/settings/SettingsPage';
import Toast from './components/common/Toast';
import AddTaskModal from './components/planner/AddTaskModal';

import { ApiService } from './services/api';
import {
  currentUser as initialUser,
  kpiMetrics,
  weeklyActivityData,
  topicMasteryData,
  aiRecommendation,
  initialStudyTasks,
  recentActivities,
  sampleQuizzes,
  sampleStudyMaterials,
  notificationsList
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [tasks, setTasks] = useState(initialStudyTasks);
  const [notifications, setNotifications] = useState(notificationsList);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [tutorPrompt, setTutorPrompt] = useState(null);
  const [selectedMaterialForTutor, setSelectedMaterialForTutor] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [materials, setMaterials] = useState([]);

  // Check backend health & sync initial materials
  useEffect(() => {
    async function initBackend() {
      const health = await ApiService.checkHealth();
      if (health.status === 'ok') {
        setBackendStatus('ok');
      } else {
        setBackendStatus('offline');
        setIsDemoMode(true);
      }

      const mats = await ApiService.getMaterials();
      setMaterials(mats);

      const serverTasks = await ApiService.getStudyPlan();
      if (serverTasks && serverTasks.length > 0) {
        setTasks(serverTasks);
      }
    }
    initBackend();
  }, []);

  // Update demo mode flag in ApiService
  useEffect(() => {
    ApiService.setDemoMode(isDemoMode);
  }, [isDemoMode]);

  // Sync dark mode with document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleToggleTask = async (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;
    const nextState = !targetTask.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextState } : t))
    );

    showToast({
      type: nextState ? 'success' : 'info',
      title: nextState ? 'Task Completed! 🎉' : 'Task Status Updated',
      message: `"${targetTask.title}" updated.`
    });

    try {
      await ApiService.updateStudyTask(id, nextState);
    } catch (err) {
      console.warn('Task sync warning:', err);
    }
  };

  const handleStartRevision = (quizId = 'quiz-dijkstra') => {
    setActiveQuizId(quizId);
    setActiveTab('practice');
    showToast({
      type: 'info',
      title: 'Targeted Revision Loaded',
      message: 'Launching Dijkstra Graph Shortest Path evaluation set.'
    });
  };

  const handleStartQuizFromMaterial = async (material) => {
    showToast({
      type: 'info',
      title: 'Generating Adaptive Quiz...',
      message: `Extracting concepts from ${material.fileName}...`
    });

    try {
      const quiz = await ApiService.generateQuiz({
        materialId: material.id,
        subject: material.topics?.[0] || 'Computer Science',
        questionCount: 5
      });
      setActiveQuizId(quiz.id);
      setActiveTab('practice');
    } catch (e) {
      handleStartRevision('quiz-dijkstra');
    }
  };

  const handleAskTutorWithMaterial = (material) => {
    setSelectedMaterialForTutor(material);
    setTutorPrompt(`Explain the core invariants and architectural principles in ${material.fileName}`);
    setActiveTab('tutor');
  };

  const handleConsultTutor = (promptTopic) => {
    const question = `Can you explain the failure modes of Dijkstra's algorithm and how to handle negative edge weights with Bellman-Ford?`;
    setTutorPrompt(question);
    setActiveTab('tutor');
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast({
      type: 'success',
      title: 'Task Created',
      message: `"${newTask.title}" added to your study schedule.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Global Add Task Modal */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}

      {/* Fixed Deep Navy Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentUser={currentUser}
      />

      {/* Main Workspace (Offset by sidebar width on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Compact Top Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setMobileOpen={setMobileOpen}
          currentUser={currentUser}
          notifications={notifications}
          setNotifications={setNotifications}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onStartQuiz={handleStartRevision}
          backendStatus={backendStatus}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* 1. Welcome Section */}
              <WelcomeBanner
                currentUser={currentUser}
                onStartRevision={() => handleStartRevision('quiz-dijkstra')}
                onOpenTutor={() => handleConsultTutor('Dijkstra')}
              />

              {/* 2. Four KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpiMetrics.map((metric) => (
                  <KpiCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* 3. AI Weakness Recommendation Card */}
              <AiRecommendationCard
                recommendation={aiRecommendation}
                onStartRevision={handleStartRevision}
                onConsultTutor={handleConsultTutor}
              />

              {/* 4. Weekly Activity & Topic Mastery Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyActivityChart data={weeklyActivityData} />
                <TopicMasterySection
                  topics={topicMasteryData}
                  onSelectSubject={(subjId) => {
                    setActiveTab('mylearning');
                  }}
                />
              </div>

              {/* 5. Upcoming Study Plan & Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StudyPlanWidget
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onViewPlanner={() => setActiveTab('planner')}
                  onAddTask={() => setIsAddTaskModalOpen(true)}
                />
                <RecentActivityWidget
                  activities={recentActivities}
                  onViewAll={() => setActiveTab('analytics')}
                />
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <LearningMaterialsPage
              materials={materials}
              setMaterials={setMaterials}
              onStartQuizFromMaterial={handleStartQuizFromMaterial}
              onOpenStudyGuide={(mat) => setActiveTab('mylearning')}
              onAskTutorWithMaterial={handleAskTutorWithMaterial}
              showToast={showToast}
            />
          )}

          {activeTab === 'mylearning' && (
            <MyLearningPage
              topics={topicMasteryData}
              studyMaterials={sampleStudyMaterials}
              onStartQuiz={handleStartRevision}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlannerPage
              tasks={tasks}
              setTasks={setTasks}
              showToast={showToast}
              onConsultTutor={handleConsultTutor}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeQuizzesPage
              quizzes={sampleQuizzes}
              activeQuizId={activeQuizId}
              onSelectQuiz={setActiveQuizId}
              onConsultTutor={handleConsultTutor}
            />
          )}

          {activeTab === 'analytics' && (
            <ProgressAnalyticsPage
              onStartQuiz={handleStartRevision}
            />
          )}

          {activeTab === 'tutor' && (
            <AiTutorPage
              initialPrompt={tutorPrompt}
              onConsumePrompt={() => setTutorPrompt('')}
              selectedMaterial={selectedMaterialForTutor}
              materials={materials}
              onStartQuiz={handleStartRevision}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
