import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/custom/Header';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../services/GlobalApi';
import { RWebShare } from 'react-web-share';

export default function View() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const { resumeId } = useParams();

  useEffect(() => {
    GlobalApi.GetResumeById(resumeId).then(resp => {
      setResumeInfo(resp.data.data);
    });
  }, [resumeId]);

  const handleDownload = () => {
    window.print();
  };

  if (!resumeInfo) return <div>Loading resume...</div>;

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        <div id='no-print'>
          <Header />
          <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
            <h2 className='text-center text-2xl font-medium'>
              🎉 Congrats! Your Ultimate AI-generated Resume is Ready
            </h2>
            <p className='text-center text-gray-400'>
              Now you are ready to download and share your unique resume URL
            </p>
            <div className='flex justify-between mx-14 my-10'>
              <Button onClick={handleDownload}>Download</Button>
              <RWebShare
                data={{
                  text: 'Hello everyone, this is my resume. Open URL to view.',
                  url: `${window.location.origin}/my-resume/${resumeId}`,
                  title: `${resumeInfo?.firstName} ${resumeInfo?.lastName} Resume`,
                }}
              >
                <Button>Share</Button>
              </RWebShare>
            </div>
          </div>
        </div>
        <div id='print-area' className='my-10 mx-10 md:mx-20 lg:mx-36'>
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}
