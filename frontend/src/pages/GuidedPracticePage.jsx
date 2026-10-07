import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PracticePlayer from '../components/GuidedPractice/PracticePlayer';
import CompletionCelebrationModal from '../components/GuidedPractice/CompletionCelebrationModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GuidedPracticePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const routineTitle = location.state?.routineTitle || 'Guided Yoga Flow';
  const yogaType = location.state?.yogaType || 'Hatha Yoga';
  const defaultPoses = [
    {
      name: 'Child’s Pose',
      sanskrit_name: 'Balasana',
      duration_sec: 45,
      rest_sec: 10,
      has_sides: 1,
      breathing_cues: 'Inhale into the back ribs, exhale to surrender weight.',
      image_url: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=800&q=80&pose=childs-pose',
      model_3d_type: 'childs_pose'
    },
    {
      name: 'Downward-Facing Dog',
      sanskrit_name: 'Adho Mukha Svanasana',
      duration_sec: 45,
      rest_sec: 10,
      has_sides: 1,
      breathing_cues: 'Inhale to lift hips skyward, exhale to melt the heart.',
      image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80&pose=downward-facing-dog',
      model_3d_type: 'downward_dog'
    },
    {
      name: 'Tree Pose',
      sanskrit_name: 'Vrikshasana',
      duration_sec: 30,
      rest_sec: 10,
      has_sides: 2,
      breathing_cues: 'Inhale to lengthen the spine, exhale to ground the standing foot.',
      image_url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80&pose=tree-pose',
      model_3d_type: 'tree_pose'
    },
    {
      name: 'Warrior II',
      sanskrit_name: 'Virabhadrasana II',
      duration_sec: 45,
      rest_sec: 10,
      has_sides: 2,
      breathing_cues: 'Inhale to expand the wingspan, exhale to ground into the stance.',
      image_url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80&pose=warrior-2',
      model_3d_type: 'warrior_two'
    },
    {
      name: 'Corpse Pose',
      sanskrit_name: 'Savasana',
      duration_sec: 60,
      rest_sec: 0,
      has_sides: 1,
      breathing_cues: 'Release all conscious control; rest in total stillness.',
      image_url: 'https://images.unsplash.com/photo-1510519138161-5844699e3840?auto=format&fit=crop&w=800&q=80&pose=corpse-pose',
      model_3d_type: 'savasana'
    }
  ];

  const poses = location.state?.poses?.length ? location.state.poses : defaultPoses;

  const [sessionId, setSessionId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  // Start session in backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.startPractice({
        routine_name: routineTitle,
        yoga_type: yogaType,
        poses: poses.map((p, idx) => ({
          pose_id: p.pose_id || p.id || null,
          pose_name: p.name,
          duration_seconds: p.duration_sec || 30,
          side: p.side || 'both',
          order_index: idx
        }))
      }).then((res) => {
        setSessionId(res.id);
      }).catch(console.error);
    }
  }, [isAuthenticated, routineTitle, yogaType, poses]);

  const handlePracticeComplete = async () => {
    const totalSec = poses.reduce((acc, p) => acc + (p.duration_sec || 30) + (p.rest_sec || 10), 0);
    const durationMin = Math.max(1, Math.round(totalSec / 60));

    if (isAuthenticated && sessionId) {
      try {
        const res = await api.completePractice({
          session_id: sessionId,
          duration_seconds: totalSec,
          completion_percentage: 100.0,
          status: 'completed'
        });
        setSessionResult({
          ...res,
          duration_minutes: durationMin
        });
      } catch (err) {
        console.error('Failed to save completion:', err);
        setSessionResult({
          duration_minutes: durationMin,
          current_streak: 1,
          total_practice_days: 1
        });
      }
    } else {
      setSessionResult({
        duration_minutes: durationMin,
        current_streak: 1,
        total_practice_days: 1
      });
    }

    setIsCompleted(true);
  };

  const handleSaveAndClose = async (moodData, redirectTarget = 'dashboard') => {
    if (isAuthenticated && sessionId && moodData) {
      try {
        await api.completePractice({
          session_id: sessionId,
          duration_seconds: sessionResult?.duration_minutes ? sessionResult.duration_minutes * 60 : 300,
          completion_percentage: 100.0,
          status: 'completed',
          mood: moodData.mood,
          energy_level: moodData.energy_level,
          notes: moodData.notes
        });
      } catch (e) {
        // ignore
      }
    }

    if (redirectTarget === 'journey') {
      navigate('/journey');
    } else if (redirectTarget === 'progress') {
      navigate('/history');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#080e0c]">
      <PracticePlayer
        routineTitle={routineTitle}
        poses={poses}
        onComplete={handlePracticeComplete}
        onExit={() => navigate('/dashboard')}
      />

      {isCompleted && (
        <CompletionCelebrationModal
          sessionResult={sessionResult}
          onSaveAndClose={handleSaveAndClose}
          onViewProgress={() => handleSaveAndClose(null, 'progress')}
          onContinueJourney={() => handleSaveAndClose(null, 'journey')}
        />
      )}
    </div>
  );
}
