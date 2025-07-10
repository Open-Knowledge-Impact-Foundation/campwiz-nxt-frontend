
import CreateCampaign_ from "./_page";
import fetchAPIFromBackendSingleWithErrorHandling from "@/server";
import { Project } from "@/types/project";
import projectAccessDeniedReason from "../../projectAccessDeniedReason";
import { uTranslation } from "@/i18n";

const CreateCampaign = async ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { projectId } = await params;
    const { t } = await uTranslation();
    const { canAccessOtherProject, reason } = await projectAccessDeniedReason(projectId);
    if (reason) {
        return <div>{t(reason)}</div>
    }
    if (!canAccessOtherProject) {
        return <div>{t("error.accessDeniedToProject")}</div>
    }
    const projectResponse = await fetchAPIFromBackendSingleWithErrorHandling<Project>(`/project/${projectId}?includeProjectLeads=true`);
    if (!projectResponse) {
        return <div>{t("error.failedToFetchProject")}</div>
    }
    if ('detail' in projectResponse) {
        return <div>{projectResponse.detail}</div>
    }
    const project = projectResponse.data;
    const projectLeads = project.projectLeads || [];
    return (
        <>
            <CreateCampaign_ projectLeads={projectLeads} projectId={projectId} />
        </>
    )
}
export default CreateCampaign