import { Award, Medal, Shield, Star, Trophy } from 'lucide-react';
import { Achievement } from '../types/index';
export const achievementList: Achievement[] = [
  {
    id: 'points-10',
    label: '10 Punkte erreicht',
    icon: <Star size={20} />,
    date: '',
  },
  {
    id: 'points-25',
    label: '25 Punkte erreicht',
    icon: <Medal size={20} />,
    date: '',
  },
  {
    id: 'points-50',
    label: '50 Punkte erreicht',
    icon: <Shield size={20} />,
    date: '',
  },
  {
    id: 'points-100',
    label: '100 Punkte erreicht',
    icon: <Trophy size={20} />,
    date: '',
  },
  {
    id: 'points-200',
    label: '200 Punkte - unaufhaltbar!',
    icon: <Award size={20} />,
    date: '',
  },
];
