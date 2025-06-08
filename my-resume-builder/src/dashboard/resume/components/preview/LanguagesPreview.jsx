import React from 'react';

export default function LanguagesPreview({ resumeInfo }) {
  // Initialize languagesList as an empty array
  let languagesList = [];

  // Safely check if resumeInfo.languages exists
  if (resumeInfo?.languages) {
    // If it's a string, attempt to parse it as JSON
    if (typeof resumeInfo.languages === 'string') {
      try {
        languagesList = JSON.parse(resumeInfo.languages);
      } catch (e) {
        console.error("Failed to parse languages JSON string in preview:", e);
        // Fallback to empty array if parsing fails
        languagesList = [];
      }
    } else if (Array.isArray(resumeInfo.languages)) {
      // If it's already an array, use it directly
      languagesList = resumeInfo.languages;
    }
  }

  // If after all checks, languagesList is empty, don't render the component
  if (!languagesList.length) {
    return null;
  }

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2' style={{ color: resumeInfo?.themeColor }}>
        Languages
      </h2>
      <ul className='list-disc ml-5 text-xs'>
        {languagesList.map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
    </div>
  );
}