import { getFirestore, doc, setDoc, addDoc, collection, getDoc, query, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebase.json"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

interface DocumentPrompt {
    university: string,
    course: string,
    subtopic: string;
    prompt: string;
    rating: number
}

interface Prompt {
    content: string;
    role: string;
    time: number;
    attachments?: any;
}

interface DocumentChat {
    name: string;
    email: string;
    chat: string;
    course: string;
    prompts: Prompt[]
}

export function addNewChat(info: DocumentChat) {
    addDoc(collection(db, "users", info.email, "chats"), {
        name: info.name,
        course: info.course,
        prompts: info.prompts
    });
}

export function addPrompt(info: DocumentPrompt) {
    addDoc(collection(db, "universities", info.university, "courses", info.course, "subjects", info.subtopic, "prompts"), {
        prompt: info.prompt,
        rating: info.rating
    }).catch((err) => {
        console.error(err)
    });
}

export class EduMetricsAPI {
    university: string;
    course: string;

    constructor() {
        this.university = "";
        this.course = "";
    }

    selectUniversity(university: string) {
        this.university = university;
    }

    selectCourse(course: string) {
        this.course = course;
    }

    async getPrompts() {
        try {
            const querySnapshot = await getDocs(
                collection(db, "universities", "Drexel", "courses", "MATH200", "subjects", "linear guy", "prompts")
            );

            console.log("Number of prompts:", querySnapshot.size);

            if (querySnapshot.empty) {
                console.warn("No prompts found!");
                return;
            }

            querySnapshot.forEach((doc) => {
                console.log("Prompt ID:", doc.id, "Data:", doc.data());
            });

            console.log((await getDocs(collection(db, "universities"))).size);

        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    }
}
