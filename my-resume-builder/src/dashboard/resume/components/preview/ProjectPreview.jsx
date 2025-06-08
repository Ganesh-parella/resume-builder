import React from 'react';

export default function ProjectsPreview({ resumeInfo }) {
  // Initialize projectsList as an empty array
  let projectsList = [];

  // Safely check if resumeInfo.projects exists and process it
  if (resumeInfo?.projects) {
    if (typeof resumeInfo.projects === 'string') {
      try {
        projectsList = JSON.parse(resumeInfo.projects);
      } catch (e) {
        console.error("Failed to parse projects JSON string in preview:", e);
        projectsList = [];
      }
    } else if (Array.isArray(resumeInfo.projects)) {
      projectsList = resumeInfo.projects;
    }
  }

  // If after all checks, projectsList is empty, don't render the component
  if (!projectsList.length) {
    return null;
  }

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2' style={{ color: resumeInfo?.themeColor }}>
        Projects
      </h2>
      <div>
        {projectsList.map((project, index) => (
          <div key={index} className='mb-3'>
            <h3 className='font-semibold text-sm'>{project.title}</h3>
            <p className='text-xs italic'>{project.techStack}</p>
            {/* Assuming project.description might also contain rich text */}
            {project?.description && (
              <p className='text-xs' dangerouslySetInnerHTML={{ __html: project.description }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}