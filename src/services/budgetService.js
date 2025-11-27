import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

const BUDGETS_COLLECTION = 'budgets';

/**
 * Add a new expense/income item.
 * @param {string} category 
 * @param {string} item 
 * @param {number} amount 
 * @param {string} type - 'expense' | 'income'
 */
export const addExpense = async (category, item, amount, type = 'expense') => {
    try {
        const docRef = await addDoc(collection(db, BUDGETS_COLLECTION), {
            category,
            item,
            amount: Number(amount),
            type,
            date: Timestamp.now(),
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding expense: ", e);
        throw e;
    }
};

/**
 * Get all budget items.
 */
export const getExpenses = async () => {
    try {
        const q = query(collection(db, BUDGETS_COLLECTION), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const expenses = [];
        querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        return expenses;
    } catch (e) {
        console.error("Error getting expenses: ", e);
        throw e;
    }
};

/**
 * Delete a budget item.
 * @param {string} id 
 */
export const deleteExpense = async (id) => {
    try {
        await deleteDoc(doc(db, BUDGETS_COLLECTION, id));
    } catch (e) {
        console.error("Error deleting expense: ", e);
        throw e;
    }
};
