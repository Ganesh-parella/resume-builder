import React from 'react';

export default function ExperiencePreview({ resumeInfo }) {
  // Initialize experienceList as an empty array
  let experienceList = [];

  // Safely check if resumeInfo.experience exists and process it
  if (resumeInfo?.experience) {
    if (typeof resumeInfo.experience === 'string') {
      try {
        experienceList = JSON.parse(resumeInfo.experience);
      } catch (e) {
        console.error("Failed to parse experience JSON string in preview:", e);
        experienceList = [];
      }
    } else if (Array.isArray(resumeInfo.experience)) {
      experienceList = resumeInfo.experience;
    }
  }

  // If after all checks, experienceList is empty, don't render the component
  if (!experienceList.length) {
    return null;
  }

  return (
    <div className='my-6'>
      <h2
        className='text-center font-bold text-sm mb-2'
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      {
        experienceList.map((experience, index) => (
          <div key={index} className='my-5'>
            <h2 className='font-bold text-sm' style={{ color: resumeInfo?.themeColor }}>
              {experience?.title}
            </h2>
            <h2 className='text-xs flex justify-between flex-wrap'>
              <span>
                {experience?.companyName}, {experience?.city}, {experience?.state}
              </span>
              <span>
                {experience?.startDate} to {experience?.currentlyWorking ? 'Present' : experience?.endDate}
              </span>
            </h2>
            {/* Using dangerouslySetInnerHTML for rich text workSummary */}
            {experience?.workSummary && (
              <div className='text-xs' dangerouslySetInnerHTML={{ __html: experience.workSummary }} />
            )}
          </div>
        ))
      }
    </div>
  );
}