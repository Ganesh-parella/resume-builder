import React, { useEffect, useState } from 'react';
import FormSection from '../components/FormSection';
import ResumePreview from '../components/ResumePreview';
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../services/GlobalApi';

export default function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    if (!resumeId) return;
    GlobalApi.GetResumeById(resumeId)
      .then(resp => {
        setResumeInfo(resp.data.data);
      })
      .catch(err => {
        console.error('Failed to load resume:', err);
        setResumeInfo({});
      });
  }, [resumeId]);

  if (!resumeInfo) {
    return <div>Loading resume data...</div>;
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}
