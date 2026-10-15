import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { Container } from "@/components/ui";
import { getProject, projects } from "@/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const path = `/work/${project.slug}`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: project.name, description: project.summary },
  };
}

/** Full case study page: direct visits, refreshes and no-JS navigation land here. */
export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <Container className="py-12 md:py-20">
      <Link href="/#work" className="mb-10 inline-flex items-center gap-2 font-medium md:mb-14">
        <span aria-hidden="true">←</span> All work
      </Link>
      <CaseStudy project={project} />
    </Container>
  );
}
