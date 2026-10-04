import type { Metadata } from 'next';
import './globals.css';
import './academic.css';
export const metadata: Metadata = { title: 'StudyPilot — Your study day, in focus', description: 'A calmer space for your courses, timetable, and deadlines.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
