import Workspace from '@/components/workspace';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ view?: string[] }> }) {
  const { view } = await params;
  const route = view?.[0] || 'overview';
  if ((view?.length || 0) > 1 || !['overview','courses','timetable','deadlines','settings'].includes(route)) notFound();
  return <Workspace view={route} />;
}
