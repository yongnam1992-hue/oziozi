import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

/**
 * Firestore Schema Design for Schedule Management
 * 
 * Collection: 'schedules' (Represents a wedding project/timeline)
 * Document Structure:
 * {
 *   userId: "user_unique_id", (For multi-user support later)
 *   weddingDate: Timestamp,
 * }
 * 
 * Subcollection: 'milestones' (under 'schedules' document or root level with userId)
 * For simplicity in this MVP, we will use a root collection 'milestones' linked by userId or just a flat list for now if auth isn't ready.
 * Let's assume a simple root collection 'milestones' for the current single-user context or we can add a 'userId' field.
 * 
 * Collection: 'milestones'
 * {
 *   title: string,       // e.g., "상견례"
 *   date: Timestamp,     // e.g., 2024-05-20
 *   description: string, // e.g., "양가 부모님 식사"
 *   isCompleted: boolean,
 *   createdAt: Timestamp
 * }
 */

const MILESTONES_COLLECTION = 'milestones';

/**
 * Add a new milestone to Firestore.
 * @param {string} title 
 * @param {Date} date 
 * @param {string} description 
 */
export const addMilestone = async (title, date, description = '') => {
    try {
        const docRef = await addDoc(collection(db, MILESTONES_COLLECTION), {
            title,
            date: Timestamp.fromDate(date),
            description,
            isCompleted: false,
            createdAt: Timestamp.now(),
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

/**
 * Fetch all milestones from Firestore, ordered by date.
 */
export const getMilestones = async () => {
    try {
        const q = query(collection(db, MILESTONES_COLLECTION), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        const milestones = [];
        querySnapshot.forEach((doc) => {
            milestones.push({ id: doc.id, ...doc.data() });
        });
        return milestones;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
};
