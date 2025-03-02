# Edumetrics

EduMetrics - Unlock Student Success with Data-Driven Tutoring

EduMetrics is an intelligent tutoring AI that helps students master difficult subjects while providing real-time insights to universities. By tracking learning patterns and pinpointing struggles, we aim to deliver personalized support and data-driven feedback to improve student outcomes and university curricula.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features
- Receive AI helper
- Real-time AI chat
- Summarizes issues students face with certain topics
- Gives detail for course improvement

## API Usage
```ts
export class EduMetricsAPI {
  // Get all universities stored in the database
  static async getUniversities();

  // Get all courses listed under the selected university
  static async getCourses(university: string): Promise<string[]>;

  // Get all subjects listed under the selected university and course
  static async getSubjects(university: string, course: string);

  // Get all prompts for a specific subject
  static async getPrompts(university: string, course: string, subject: string);

  // Get the average rating of a specific subject
  static async getSubjectAverageRating(university: string, course: string, subject: string);

  // Get the average rating of a specific course
  static async getCourseAverageRating(university: string, course: string);

  // Generate a summary for a specific subject based on prompts
  static async getSubjectSummary(university: string, course: string, subject: string);

  // Generate a summary for a specific course based on subject summaries
  static async getCourseSummary(university: string, course: string);
}
```

## Technologies Used
- React.js
- TypeScript
- Tailwind
- Next.js
- firebase
- OpenAPI Integration

## Getting Started

**Prerequisites**
- Node.js
- https://nodejs.org/


**Installation**
1. clone this repository:

   ```bash
   git clone
   ```
2. Navigate to the project directory

    ```bash
   cd edumetrics
    ```
3. Install dependencies

    ```bash
   npm install
    ```
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

