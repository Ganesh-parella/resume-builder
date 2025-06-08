import React from 'react';

export default function SkillPreview({ resumeInfo }) {
  // Ensure skills is always an array, even if it's null, undefined, or a string that needs parsing.
  let skillsList = [];
  if (resumeInfo?.skills) {
    if (typeof resumeInfo.skills === 'string') {
      try {
        skillsList = JSON.parse(resumeInfo.skills);
      } catch (e) {
        console.error("Failed to parse skills JSON string in preview:", e);
        // Fallback to empty array if parsing fails
        skillsList = [];
      }
    } else if (Array.isArray(resumeInfo.skills)) {
      skillsList = resumeInfo.skills;
    }
  }

  return (
    <div className='my-6'>
      {/* Conditionally render the entire skills section only if there are entries */}
      {skillsList.length > 0 && (
        <>
          <h2 className='text-center font-bold text-sm mb-2'
              style={{ color: resumeInfo?.themeColor }}>
            Skills
          </h2>
          <ul className='list-disc pl-5 mt-2'>
            {
              skillsList.map((skill, index) => (
                <li key={index} className='text-xs font-medium'>
                  {skill?.name}
                </li>
              ))
            }
          </ul>
        </>
      )}
    </div>
  );
}