import { useEffect, useState } from 'react';

interface CourseData {
  subject_code: string;
  course_number: string;
  crn: number;
  course_title: string;
  credits: string;
  instructors?: { name: string }[];
  instruction_type?: string;
}

export interface ParsedCourse {
  id: string; // Combination of subject_code and course_number
  name: string; // Full course name (e.g., "CS 171")
  title: string; // Course title
  crns: number[]; // List of CRNs for this course
  credits: string;
  subjectCode: string; // Subject code (e.g., "CS")
  courseNumber: string; // Course number (e.g., "171")
}

// Function to fetch and parse the course data
export async function parseCourseData(): Promise<ParsedCourse[]> {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error('Failed to fetch course data');
    }
    
    const data = await response.json();
    const courses: Record<string, ParsedCourse> = {};
    
    // Loop through all entries in the data JSON
    Object.entries(data).forEach(([crn, courseData]) => {
      const courseInfo = courseData as CourseData;
      
      // Skip courses with instruction_type "Lab"
      if (courseInfo.instruction_type === "Lab") {
        return;
      }
      
      const courseId = `${courseInfo.subject_code} ${courseInfo.course_number}`;
      const crnNumber = parseInt(crn);
      
      // If this course already exists, just add the CRN
      if (courses[courseId]) {
        courses[courseId].crns.push(crnNumber);
      } else {
        // Otherwise create a new course entry
        courses[courseId] = {
          id: courseId,
          name: courseId,
          title: courseInfo.course_title,
          crns: [crnNumber],
          credits: courseInfo.credits,
          subjectCode: courseInfo.subject_code,
          courseNumber: courseInfo.course_number
        };
      }
    });
    
    // Convert the object to an array and sort it
    return Object.values(courses).sort((a, b) => {
      // First sort by subject code alphabetically
      if (a.subjectCode < b.subjectCode) return -1;
      if (a.subjectCode > b.subjectCode) return 1;
      
      // Then sort by course number numerically
      const aNum = parseInt(a.courseNumber);
      const bNum = parseInt(b.courseNumber);
      return aNum - bNum;
    });
  } catch (error) {
    console.error('Error parsing course data:', error);
    return [];
  }
}

// Hook to use the course data in components
export function useCourseData() {
  const [courses, setCourses] = useState<ParsedCourse[]>([]);
  const [subjectCodes, setSubjectCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const parsedCourses = await parseCourseData();
        setCourses(parsedCourses);
        
        // Extract unique subject codes
        const subjects = new Set<string>();
        parsedCourses.forEach(course => {
          const subjectCode = course.name.split(' ')[0];
          subjects.add(subjectCode);
        });
        
        setSubjectCodes(Array.from(subjects).sort());
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { courses, subjectCodes, loading, error };
}

// For testing purposes, we'll create a small sample of courses
export function getSampleCourses(): ParsedCourse[] {
  return [
    {
      id: 'CS 171',
      name: 'CS 171',
      title: 'Computer Programming I',
      crns: [12345, 12346],
      credits: '3.00',
      subjectCode: 'CS',
      courseNumber: '171'
    },
    {
      id: 'ENGL 102',
      name: 'ENGL 102',
      title: 'English Composition',
      crns: [34567, 34568, 34569],
      credits: '3.00',
      subjectCode: 'ENGL',
      courseNumber: '102'
    },
    {
      id: 'MATH 200',
      name: 'MATH 200',
      title: 'Multivariate Calculus',
      crns: [23456],
      credits: '4.00',
      subjectCode: 'MATH',
      courseNumber: '200'
    }
  ].sort((a, b) => {
    // First sort by subject code alphabetically
    if (a.subjectCode < b.subjectCode) return -1;
    if (a.subjectCode > b.subjectCode) return 1;
    
    // Then sort by course number numerically
    const aNum = parseInt(a.courseNumber);
    const bNum = parseInt(b.courseNumber);
    return aNum - bNum;
  });
} 