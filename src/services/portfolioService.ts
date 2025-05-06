import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getSkills = async () => {
  const skillsCol = collection(db, 'skills');
  const snapshot = await getDocs(skillsCol);
  return snapshot.docs.map(doc => doc.data());
};

export const submitContactForm = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  // Implement Firebase form submission
};