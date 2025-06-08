// src/components/resume/ResumePreview.jsx

import React, { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import PersionalDetailPreview from './preview/PersionalDetailPreview';
import SummaryPreview from './preview/SummaryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillPreview from './preview/SkillPreview';
import HobbiesPreview from './preview/HobbiesPreview';
import CertificationsPreview from './preview/CertificatePreview';
import ProjectPreview from './preview/ProjectPreview';
import LanguagePreview from './preview/LanguagesPreview';

// Helper component for HR lines
const HrLine = ({ resumeInfo, className = 'my-2' }) => {
  // Conditionally render based on enableHrLines
  if (!resumeInfo?.enableHrLines) { // <-- Check for enableHrLines
    return null; // Don't render HR line if disabled
  }
  return <hr style={{ borderColor: resumeInfo?.themeColor }} className={className} />;
};

export default function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) return null;

  const selectedLayout = resumeInfo.layout || 'default';

  return (
    <div
      className='shadow-lg p-10 h-full border-t-[20px] overflow-auto'
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/*
        ============================================================
        Layout 1: Default (Left Sidebar)
        ============================================================
      */}
      {selectedLayout === 'default' && (
        <div className='grid grid-cols-3 gap-8'>
          <div className='col-span-1'>
            <PersionalDetailPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} /> {/* Conditionally rendered */}
            <SkillPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <LanguagePreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <HobbiesPreview resumeInfo={resumeInfo} />
          </div>

          <div className='col-span-2'>
            <SummaryPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <ExperiencePreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <EducationalPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <ProjectPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <CertificationsPreview resumeInfo={resumeInfo} />
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 2: Top Header (Personal & Summary) + 2-Column Main
        ============================================================
      */}
      {selectedLayout === 'layout-top-summary' && (
        <div className='flex flex-col'>
          <PersionalDetailPreview resumeInfo={resumeInfo} />
          <SummaryPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-4' /> {/* Conditionally rendered */}

          <div className='grid grid-cols-2 gap-8'>
            <div className='col-span-1'>
              <ExperiencePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <EducationalPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <ProjectPreview resumeInfo={resumeInfo} />
            </div>
            <div className='col-span-1'>
              <SkillPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <CertificationsPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <LanguagePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <HobbiesPreview resumeInfo={resumeInfo} />
            </div>
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 3: Right Sidebar
        ============================================================
      */}
      {selectedLayout === 'layout-right-sidebar' && (
        <div className='grid grid-cols-3 gap-8'>
          <div className='col-span-2'>
            <SummaryPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <ExperiencePreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <EducationalPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <ProjectPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <CertificationsPreview resumeInfo={resumeInfo} />
          </div>
          <div className='col-span-1'>
            <PersionalDetailPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <SkillPreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <LanguagePreview resumeInfo={resumeInfo} />
            <HrLine resumeInfo={resumeInfo} />
            <HobbiesPreview resumeInfo={resumeInfo} />
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 4: Experiential Focus
        ============================================================
      */}
      {selectedLayout === 'layout-experiential-focus' && (
        <div className='flex flex-col'>
          <PersionalDetailPreview resumeInfo={resumeInfo} />
          <SummaryPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-4' />

          <div className='grid grid-cols-2 gap-8'>
            <div className='col-span-1'>
              <ExperiencePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <ProjectPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <EducationalPreview resumeInfo={resumeInfo} />
            </div>
            <div className='col-span-1'>
              <SkillPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <CertificationsPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <LanguagePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <HobbiesPreview resumeInfo={resumeInfo} />
            </div>
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 5: Two Column Equal
        ============================================================
      */}
      {selectedLayout === 'layout-two-column-equal' && (
        <div className='flex flex-col'>
          <PersionalDetailPreview resumeInfo={resumeInfo} />
          <SummaryPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-4' />

          <div className='grid grid-cols-2 gap-8'>
            {/* Column 1 */}
            <div className='col-span-1'>
              <ExperiencePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <SkillPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <CertificationsPreview resumeInfo={resumeInfo} />
            </div>
            {/* Column 2 */}
            <div className='col-span-1'>
              <EducationalPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <ProjectPreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <LanguagePreview resumeInfo={resumeInfo} />
              <HrLine resumeInfo={resumeInfo} />
              <HobbiesPreview resumeInfo={resumeInfo} />
            </div>
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 6: Main Content Centric (Naturally no HRs in this structure, relying on gap)
        No HrLine calls needed here as it's designed without them.
        ============================================================
      */}
      {selectedLayout === 'layout-main-content-centric' && (
        <div className='flex flex-col gap-8'>
          <div className="text-center">
            <PersionalDetailPreview resumeInfo={resumeInfo} />
          </div>

          <div className='grid grid-cols-3 gap-x-12 gap-y-8'>
            <div className='col-span-2 flex flex-col gap-6'>
              <SummaryPreview resumeInfo={resumeInfo} />
              <ExperiencePreview resumeInfo={resumeInfo} />
              <ProjectPreview resumeInfo={resumeInfo} />
              <CertificationsPreview resumeInfo={resumeInfo} />
            </div>
            <div className='col-span-1 flex flex-col gap-6'>
              <SkillPreview resumeInfo={resumeInfo} />
              <EducationalPreview resumeInfo={resumeInfo} />
              <LanguagePreview resumeInfo={resumeInfo} />
              <HobbiesPreview resumeInfo={resumeInfo} />
            </div>
          </div>
        </div>
      )}

      {/*
        ============================================================
        Layout 7: Clean Sectioned (Single Column with Explicit HRs)
        These HRs are meant to be prominent, so they are always rendered if this layout is chosen.
        The HrLine component itself still checks enableHrLines, so the user's global preference applies.
        ============================================================
      */}
      {selectedLayout === 'layout-clean-sectioned' && (
        <div className='flex flex-col'>
          <PersionalDetailPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <SummaryPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <ExperiencePreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <EducationalPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <SkillPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <ProjectPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <CertificationsPreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <LanguagePreview resumeInfo={resumeInfo} />
          <HrLine resumeInfo={resumeInfo} className='my-6 border-2' />
          <HobbiesPreview resumeInfo={resumeInfo} />
        </div>
      )}

      {/* Add other layouts as needed */}

    </div>
  );
}