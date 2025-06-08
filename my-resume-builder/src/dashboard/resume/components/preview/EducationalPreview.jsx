// EducationalPreview.jsx

import React from 'react';

export default function EducationalPreview({ resumeInfo }) {
  // Ensure education is always an array, even if it's null, undefined, or a string that needs parsing.
  // This makes the map() call safe.
  let educationList = [];
  if (resumeInfo?.education) {
    if (typeof resumeInfo.education === 'string') {
      try {
        educationList = JSON.parse(resumeInfo.education);
      } catch (e) {
        console.error("Failed to parse education JSON string in preview:", e);
        // Fallback to empty array if parsing fails
        educationList = [];
      }
    } else if (Array.isArray(resumeInfo.education)) {
      educationList = resumeInfo.education;
    }
  }

  return (
    <div className='my-6'>
      {/* Conditionally render the entire education section only if there are entries */}
      {educationList.length > 0 && (
        <>
          <h2 className='text-center font-bold text-sm mb-2'
              style={{ color: resumeInfo?.themeColor }}>Education</h2>
          
          {/* You had a commented out <hr> tag, uncomment if needed for a separator */}
          {/* <hr style={{ borderColor: resumeInfo?.themeColor }} /> */}
          
          {educationList.map((education, index) => (
            <div key={index} className='my-5'>
              <h2 className='font-bold text-sm' style={{ color: resumeInfo?.themeColor }}>
                {education.universityName}
              </h2>
              <h2 className='text-xs flex justify-between'>
                {education?.degree} in {education?.major}
              </h2>
              <span className='text-xs'>
                {education?.startDate} - {education?.endDate}
              </span>
              {/* Use dangerouslySetInnerHTML to render HTML content from RichTextEditor */}
              {education?.description && (
                <p className='text-xs my-2' dangerouslySetInnerHTML={{ __html: education.description }} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}