import { notFound } from "next/navigation";
import { CaseStudy, CaseStudyOverlay } from "@/components/case-study";
import { getProject, projects } from "@/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Intercepted case study: opened from the work grid, shown over the home page. */
export default async function WorkOverlay({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const titleId = `case-study-${project.slug}`;

  return (
    <CaseStudyOverlay titleId={titleId}>
      <CaseStudy project={project} inOverlay titleId={titleId} />
    </CaseStudyOverlay>
  );
}
