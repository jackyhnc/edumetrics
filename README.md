# EduMetrics

EduMetrics - Empowering Schools with AI-Driven Learning Analytics

EduMetrics is an AI-powered analytics platform and tutoring chatbot that helps universities identify student learning challenges through real-time data insights. By analyzing student interactions with their AI tutor, we track learning patterns, pinpoint struggles, and provide institutions with actionable data to enhance curricula and support student success. EduMetrics offers an intuitive web application for students and faculty, along with a user-friendly API for seamless integration.

<img width="1412" alt="image" src="https://github.com/user-attachments/assets/970e1aef-962e-4c9c-b6c1-2df82978ec7f" />

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
- Next.js
- React.js
- TypeScript
- OpenAPI Integration
- Firebase
- Tailwind

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

## Contributing

We'd happily welcome any community contributions! If you would like to work with EduMetrics, please get in touch with us!

## Learn More

To learn more about Next.js, take a look at the following resources:



