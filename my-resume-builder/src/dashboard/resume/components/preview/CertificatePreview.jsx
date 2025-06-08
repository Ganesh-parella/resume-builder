import React from 'react';

export default function CertificationsPreview({ resumeInfo }) {
  // Initialize certificationsList as an empty array
  let certificationsList = [];

  // Safely check if resumeInfo.certifications exists and process it
  if (resumeInfo?.certifications) {
    if (typeof resumeInfo.certifications === 'string') {
      try {
        certificationsList = JSON.parse(resumeInfo.certifications);
      } catch (e) {
        console.error("Failed to parse certifications JSON string in preview:", e);
        certificationsList = [];
      }
    } else if (Array.isArray(resumeInfo.certifications)) {
      certificationsList = resumeInfo.certifications;
    }
  }

  // If after all checks, certificationsList is empty, don't render the component
  if (!certificationsList.length) {
    return null;
  }

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2' style={{ color: resumeInfo?.themeColor }}>
        Certifications
      </h2>
      <ul className='list-disc ml-5 text-xs'>
        {certificationsList.map((cert, index) => (
          <li key={index}>
            {cert.title} — <span className='italic'>{cert.issuer}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}