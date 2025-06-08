// src/components/dashboard/builder/FormSection.jsx

import React, { useState, useContext } from 'react'; // Import useContext
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PersonalDetailForm from './Form/PersonalDetailForm';
import Summary from './Form/Summary';
import Experience from './Form/Experience';
import Education from './Form/Education';
import Skills from './Form/Skills';
import Projects from './Form/Projects';
import Certifications from './Form/Certifications';
import HobbiesLanguages from './Form/HobbiesLanguages';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';
import LayoutSelector from './LayoutSelector';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have Shadcn Checkbox
import { Label } from '@/components/ui/label';      // Assuming you have Shadcn Label
import { ResumeInfoContext } from '@/context/ResumeInfoContext'; // Import ResumeInfoContext

export default function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // Get and set resumeInfo from context
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleNext = () => {
    if (enableNext) {
      if (activeFormIndex === 8) {
        navigate(`/my-resume/${resumeId}/view`);
      } else {
        setActiveFormIndex(activeFormIndex + 1);
        setEnableNext(false);
      }
    } else {
      toast.info("Please save your current section before proceeding to the next.");
    }
  };

  const handlePrev = () => {
    setActiveFormIndex(activeFormIndex - 1);
    setEnableNext(true);
  };

  // Handler for HR lines toggle
  const handleHrLinesToggle = (checked) => {
    setResumeInfo(prev => ({
      ...prev,
      enableHrLines: checked // Update the context
    }));
    // Optionally, save this preference to Strapi immediately
    // GlobalApi.UpdateResumeDetail(resumeId, { data: { enableHrLines: checked }})
    //   .then(() => toast.success('HR lines preference updated!'))
    //   .catch(err => console.error('Failed to save HR lines preference', err));
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        {/* Theme, Layout, and HR Toggle Group */}
        <div className="flex gap-4 items-center"> {/* Adjusted gap for better spacing */}
            <ThemeColor />
            <LayoutSelector />
            {/* HR Lines Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hr-lines"
                checked={resumeInfo.enableHrLines} // Control checked state from context
                onCheckedChange={handleHrLinesToggle} // Call handler on change
              />
              <Label htmlFor="hr-lines" className="text-sm">Show HR Lines</Label>
            </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button onClick={handlePrev} className="flex gap-2" size="sm">
              <ArrowLeft /> Prev
            </Button>
          )}
          <Button
            disabled={!enableNext}
            onClick={handleNext}
            className="flex gap-2"
            size="sm"
          >
            {activeFormIndex === 8 ? 'Finish' : 'Next'} <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Conditional Rendering of Forms (remains unchanged) */}
      {activeFormIndex === 1 && <PersonalDetailForm enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 2 && <Summary enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 3 && <Experience enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 4 && <Education enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 5 && <Skills enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 6 && <Projects enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 7 && <Certifications enableNext={(v) => setEnableNext(v)} />}
      {activeFormIndex === 8 && <HobbiesLanguages enableNext={(v) => setEnableNext(v)} />}
    </div>
  );
}