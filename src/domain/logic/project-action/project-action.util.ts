import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';

type SetProjectRequireRegenerateOpts = {
  project: Project;
  projectDocuments: ProjectDocument[];
};
export function setProjectRequireRegenerate({
  project,
  projectDocuments,
}: SetProjectRequireRegenerateOpts) {
  projectDocuments.forEach((doc) => {
    if (doc.isRequireRegenerate || doc.isStatusChanged) {
      project.edit({
        data: { isRequireRegenerate: true },
      });
    }
  });
}
