import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  CollectionReference,
  DocumentData,
  query,
  where,
  DocumentReference,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { generateText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import firebaseConfig from "./firebase.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

interface DocumentUser {
  email: string;
  university: string;
  role: string;
}

interface DocumentCourse {
  university: string;
  course: string;
  description?: string;
  credits?: number;
  sections?: number;
}

interface DocumentPrompt extends DocumentCourse {
  subtopic: string;
  prompt: string;
  rating: number;
}

interface DocumentChat extends DocumentUser {
  name: string;
  course: string;
  prompts: Array<{
    id: string;
    content: string;
    role: "system" | "user" | "assistant" | "data";
  }>;
}

async function findDoc(
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  field: string,
  value: unknown
): Promise<DocumentReference<unknown, DocumentData> | null> {
  const snapshot = await getDocs(query(collectionRef, where(field, "==", value)));

  // Return existing document reference
  if (!snapshot.empty) {
    return snapshot.docs[0].ref;
  }
  return null;
}

async function findOrCreateDoc(
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  field: string,
  value: unknown,
  additionalData = {}
) {
  const docRef = await findDoc(collectionRef, field, value);
  return docRef ?? (await addDoc(collectionRef, { [field]: value, ...additionalData }));
}

export async function addNewUser(docInfo: DocumentUser) {
  const usersRef = collection(db, "users");

  return await findOrCreateDoc(usersRef, "email", docInfo.email, {
    role: docInfo.role,
    university: docInfo.university,
  });
}

export async function addNewChat(info: DocumentChat) {
  // Find or create user
  const userRef = await addNewUser({
    email: info.email,
    university: info.university,
    role: info.role,
  });

  // Check if chat exists
  const chatRef = await findOrCreateDoc(collection(userRef, "chats"), "name", info.name, {
    course: info.course,
    prompts: info.prompts,
  });

  return chatRef;
}

export async function addNewCourse(info: DocumentCourse) {
  const uniRef = await findOrCreateDoc(collection(db, "universities"), "name", info.university);

  return await findOrCreateDoc(collection(uniRef, "courses"), "name", info.course);
}

export async function addPrompt(info: DocumentPrompt) {
  const courseRef = await addNewCourse(info);
  const subjectRef = await findOrCreateDoc(collection(courseRef, "subjects"), "subtopic", info.subtopic);

  return await findOrCreateDoc(collection(subjectRef, "prompts"), "prompt", info.prompt, {
    rating: info.rating,
  });
}

export async function getChats(info: DocumentUser) {
  const userRef = await findDoc(collection(db, "users"), "email", info.email);
  const chatsRef = userRef && (await getDocs(collection(userRef, "chats")));

  if (!chatsRef) {
    return [];
  }
  return chatsRef.docs.map((doc) => doc.data());
}

export class EduMetricsAPI {
  // Get all universities stored in database
  static async getUniversities() {
    return (await getDocs(collection(db, "universities"))).docs.map((doc) => doc.data().name);
  }

  // Get all courses listed under selected university
  static async getCourses(university: string) {
    const docRef = await findDoc(collection(db, "universities"), "name", university);

    if (!docRef) {
      return [];
    }
    return (await getDocs(collection(docRef, "courses"))).docs.map((doc) => doc.data().name);
  }

  // Get all subjects listed under selected university and course
  static async getSubjects(university: string, course: string) {
    const uniRef = await findDoc(collection(db, "universities"), "name", university);
    const courseRef = uniRef && (await findDoc(collection(uniRef, "courses"), "name", course));

    if (!courseRef) {
      return [];
    }

    return (await getDocs(collection(courseRef, "subjects"))).docs.map((doc) => doc.data().subtopic);
  }

  // Get all prompts for a specific subject
  static async getPrompts(university: string, course: string, subject: string) {
    const uniRef = await findDoc(collection(db, "universities"), "name", university);
    const courseRef = uniRef && (await findDoc(collection(uniRef, "courses"), "name", course));
    const subjectRef = courseRef && (await findDoc(collection(courseRef, "subjects"), "subtopic", subject));

    if (!subjectRef) {
      return [];
    }

    const promptsSnapshot = await getDocs(collection(subjectRef, "prompts"));
    return promptsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        prompt: data.prompt,
        rating: data.rating,
      };
    });
  }

  static async getSubjectAverageRating(university: string, course: string, subject: string) {
    const prompts = await this.getPrompts(university, course, subject);
    const averageRating = prompts.reduce((sum, prompt) => sum + prompt.rating, 0) / prompts.length;
    return averageRating;
  }

  static async getCourseAverageRating(university: string, course: string) {
    const subjects = await this.getSubjects(university, course);
    const subjectAverageRatings = await Promise.all(
      subjects.map((subject) => this.getSubjectAverageRating(university, course, subject))
    );
    const averageRating = subjectAverageRatings.reduce((sum, rating) => sum + rating, 0) / subjectAverageRatings.length;
    return averageRating;
  }

  static async getSubjectSummary(university: string, course: string, subject: string) {
    const prompts = await this.getPrompts(university, course, subject);
    const prompt = prompts.map((p) => p.prompt).join("\n");
    const { text } = await generateText({
      model: openai("gpt-4o"),
      // system: `You are EduMetrics, an AI built for the benefit of students and universities.
      // Gather all the prompts under the course. Anaylze where students fall short the most, as well as where the exceed.
      // Report this data back to the institution/professor that requested it and provide actions that could be taken to
      // improve students sucess within for the next semster as well as in a few years.`,
      system: `You are EduMetrics, an AI designed to gather prompts under an academic institutional course.
            You will analyze the prompts and report this data back to the academic institution and its faculty.
            The report should be written in a way to understand what students are struggling with.`,
      prompt: prompt,
    });
    return text;
  }

  static async getCourseSummary(university: string, course: string) {
    const subjects = await this.getSubjects(university, course);
    const subjectSummaries = await Promise.all(
      subjects.map((subject) => this.getSubjectSummary(university, course, subject))
    );
    return subjectSummaries.join("\n");
  }
}

// addNewChat({
//     name: "linear dude",
//     email: "hanc.llc@gmail.com",
//     role: "student",
//     course: "MATH200",
//     prompts: [],
// });

// addPrompt({
//     university: "Drexel",
//     course: "MATH200",
//     rating: 3.4,
//     subtopic: "Gradient",
//     prompt: "What is a gradient?",
// });

// EduMetricsAPI.getUniversities().then(console.log);
// EduMetricsAPI.getCourses("Drexel").then(console.log);
// EduMetricsAPI.getSubjects("Drexel", "MATH200").then(console.log);
// EduMetricsAPI.getPrompts("Drexel", "MATH200", "Gradient").then(console.log);
// EduMetricsAPI.getSubjectAverageRating("Drexel", "MATH200", "Gradient").then(console.log);
// EduMetricsAPI.getCourseAverageRating("Drexel", "MATH200").then(console.log);
// EduMetricsAPI.getSubjectSummary("Drexel", "MATH200", "Gradient").then(console.log);
// EduMetricsAPI.getCourseSummary("Drexel", "MATH200").then(console.log);
