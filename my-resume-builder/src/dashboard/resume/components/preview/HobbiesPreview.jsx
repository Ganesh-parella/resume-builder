import React from 'react';

export default function HobbiesPreview({ resumeInfo }) {
  // Initialize hobbiesList as an empty array
  let hobbiesList = [];

  // Safely check if resumeInfo.hobbies exists and process it
  if (resumeInfo?.hobbies) {
    // If it's a string, attempt to parse it as JSON
    if (typeof resumeInfo.hobbies === 'string') {
      try {
        hobbiesList = JSON.parse(resumeInfo.hobbies);
      } catch (e) {
        console.error("Failed to parse hobbies JSON string in preview:", e);
        // Fallback to empty array if parsing fails
        hobbiesList = [];
      }
    } else if (Array.isArray(resumeInfo.hobbies)) {
      // If it's already an array, use it directly
      hobbiesList = resumeInfo.hobbies;
    }
    // If it's some other non-array, non-string type, it will remain an empty array.
  }

  // If, after all checks, hobbiesList is empty, don't render the component
  if (!hobbiesList.length) {
    return null;
  }

  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color: resumeInfo?.themeColor }}>
        Hobbies
      </h2>
      <ul className="list-disc list-inside text-xs">
        {hobbiesList.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}