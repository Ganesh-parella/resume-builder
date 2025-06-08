import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, PlusCircle, XCircle } from 'lucide-react';

export default function Skills({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const hasInitializedFromResumeInfo = useRef(false);

  useEffect(() => {
    if (resumeInfo && !hasInitializedFromResumeInfo.current) {
      if (resumeInfo.skills && resumeInfo.skills.length > 0) {
        // Skills are stored as JSON string in Strapi, so parse it
        const parsedSkills = typeof resumeInfo.skills === 'string'
          ? JSON.parse(resumeInfo.skills)
          : resumeInfo.skills;
        setSkillsList(parsedSkills);
      }
      hasInitializedFromResumeInfo.current = true;
    }
  }, [resumeInfo]);

  useEffect(() => {
    if (!hasInitializedFromResumeInfo.current) {
      return;
    }

    const currentContextSkills = resumeInfo?.skills && typeof resumeInfo.skills === 'string'
      ? JSON.parse(resumeInfo.skills)
      : resumeInfo?.skills || [];

    const areContentsEqual = JSON.stringify(skillsList) === JSON.stringify(currentContextSkills);

    if (!areContentsEqual) {
      setResumeInfo(prev => ({
        ...prev,
        skills: skillsList,
      }));
    }
  }, [skillsList, setResumeInfo, resumeInfo?.skills]);

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skillsList.some(skill => skill.name.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSkillsList([...skillsList, { name: trimmedSkill }]);
      setNewSkill('');
      if (enableNext) enableNext(false);
    } else if (trimmedSkill) {
      toast.info('Skill already exists!');
    }
  };

  const removeSkill = (skillToRemoveName) => {
    setSkillsList(skillsList.filter(skill => skill.name !== skillToRemoveName));
    if (enableNext) enableNext(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (enableNext) enableNext(false);

    try {
      const data = {
        data: {
          skills: JSON.stringify(skillsList), // Stringify the array for Strapi
        },
      };

      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      if (enableNext) enableNext(true);
      toast.success('Skills updated successfully!');
    } catch (err) {
      console.error('Error saving skills:', err);
      toast.error('Failed to save skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Skills</h2>
        <p>Add your relevant skills</p>
        <form onSubmit={onSave} className="mt-7">
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              placeholder="Add a new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (addSkill(), e.preventDefault())}
            />
            <Button type="button" onClick={addSkill}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {skillsList.map((skill, index) => (
              <Badge
                key={index}
                className="bg-primary text-white p-2 px-3 flex items-center gap-1 cursor-pointer"
                onClick={() => removeSkill(skill.name)}
              >
                {skill.name}
                <XCircle className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>

          <div className='flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save Skills'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}