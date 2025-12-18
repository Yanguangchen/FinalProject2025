import React from 'react';
import { View } from 'react-native';
import FourOptions from '../UI/4options';
import SixOption from '../UI/6option';
import { useNavigation, useRoute } from '@react-navigation/native';
import levels from '../levels.json';

/**
 * Generic LevelScreen
 * Reads quizzes for a given levelId and steps through them.
 * Props:
 * - levelId?: number (fallback to route.params.levelId, default 1)
 */
export default function LevelScreen({ levelId: propLevelId }) {
  const nav = useNavigation();
  const route = useRoute();
  const levelId =
    typeof propLevelId === 'number'
      ? propLevelId
      : (route?.params && typeof route.params.levelId === 'number' && route.params.levelId) || 1;

  const level = React.useMemo(() => {
    try {
      if (levels && levels.levels) {
        return levels.levels.find((l) => l.level_id === levelId);
      }
    } catch (_e) {}
    return undefined;
  }, [levelId]);

  const quizzes = level?.quizzes || [];
  const [idx, setIdx] = React.useState(0);
  const quiz = quizzes[idx];

  const handleClose = React.useCallback(() => {
    try {
      nav.navigate('Home');
    } catch (_e) {}
  }, [nav]);

  const handleMoveOn = React.useCallback(() => {
    if (idx + 1 < quizzes.length) {
      setIdx(idx + 1);
    } else {
      try {
        nav.navigate('Home');
      } catch (_e) {}
    }
  }, [idx, quizzes.length, nav]);

  if (!quiz) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }
  const opts = quiz.options || [];
  const title = quiz.prompt || quiz.title || '';

  if (quiz.type === 'multi_select_4') {
    return (
      <FourOptions
        title={title}
        subtitle="Select All"
        options={opts}
        onClose={handleClose}
        onMoveOn={handleMoveOn}
      />
    );
  }
  return (
    <SixOption
      title={title}
      subtitle="Select All"
      options={opts}
      onClose={handleClose}
      onMoveOn={handleMoveOn}
    />
  );
}


