import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '../RichTextEditor'; // Using RichTextEditor for description
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle, PlusCircle, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';
import { generateFromAI } from '../../../../../services/AIModel'; // For AI generation

const formField = {
  title: '',
  techStack: '',
  description: '', // This will be handled by RichTextEditor
  link: '',
};

export default function Projects({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

  const hasInitializedFromResumeInfo = useRef(false);

  useEffect(() => {
    if (resumeInfo && !hasInitializedFromResumeInfo.current) {
      if (resumeInfo.projects && resumeInfo.projects.length > 0) {
        // Projects are stored as JSON string in Strapi, so parse it
        const parsedProjects = typeof resumeInfo.projects === 'string'
          ? JSON.parse(resumeInfo.projects)
          : resumeInfo.projects;
        setProjectsList(parsedProjects);
      } else {
        setProjectsList([formField]);
      }
      hasInitializedFromResumeInfo.current = true;
    } else if (!resumeInfo && !hasInitializedFromResumeInfo.current) {
        setProjectsList([formField]);
        hasInitializedFromResumeInfo.current = true;
    }
  }, [resumeInfo]);

  useEffect(() => {
    if (!hasInitializedFromResumeInfo.current) {
      return;
    }
    const currentContextProjects = resumeInfo?.projects && typeof resumeInfo.projects === 'string'
      ? JSON.parse(resumeInfo.projects)
      : resumeInfo?.projects || [];

    const areContentsEqual = JSON.stringify(projectsList) === JSON.stringify(currentContextProjects);

    if (!areContentsEqual) {
      setResumeInfo(prev => ({
        ...prev,
        projects: projectsList,
      }));
    }
  }, [projectsList, setResumeInfo, resumeInfo?.projects]);


  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...projectsList];
    newEntries[index][name] = value;
    setProjectsList(newEntries);
    if (enableNext) enableNext(false);
  };

  const handleRichTextEditorChange = (value, name, index) => {
    const newEntries = [...projectsList];
    newEntries[index][name] = value;
    setProjectsList(newEntries);
    if (enableNext) enableNext(false);
  };

  const addNewProject = () => {
    setProjectsList([...projectsList, { ...formField }]);
    if (enableNext) enableNext(false);
  };

  const removeProject = (indexToRemove) => {
    if (projectsList.length > 1) {
      setProjectsList(projectsList.filter((_, index) => index !== indexToRemove));
      if (enableNext) enableNext(false);
    } else {
      toast.error("You must have at least one project entry.");
    }
  };

  const generateDescriptionFromAI = async (index) => {
    setAiLoadingIndex(index);
    if (enableNext) enableNext(false);

    const project = projectsList[index];
    const prompt = `
      Generate 2-3 concise bullet points for the description of a project for a resume.
      The project title is "${project.title || 'A Project'}" and technologies used include "${project.techStack || 'Various Technologies'}".
      Focus on the project's purpose, your role, and key features/outcomes.
      Return the description as a single string with each bullet point on a new line (use hyphens or asterisks for bullets).
      Do NOT include any additional text, preamble, or formatting outside of the bullet points.
    `;

    try {
      const generatedText = await generateFromAI(prompt);
      const updatedList = projectsList.map((proj, i) =>
        i === index ? { ...proj, description: generatedText.trim() } : proj
      );
      setProjectsList(updatedList);
      toast.success('Project description generated from AI!');
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Failed to generate description. Please check your AI API setup.');
    } finally {
      setAiLoadingIndex(null);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (enableNext) enableNext(false);

    const isValid = projectsList.every(proj =>
        proj.title.trim() !== '' &&
        proj.description.trim() !== ''
    );

    if (!isValid) {
        toast.error('Please fill out Project Title and Description for all entries.');
        setLoading(false);
        return;
    }

    try {
      const data = {
        data: {
          projects: JSON.stringify(projectsList), // Stringify the array for Strapi
        },
      };

      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      if (enableNext) enableNext(true);
      toast.success('Project details updated successfully!');
    } catch (err) {
      console.error('Error saving projects:', err);
      toast.error('Failed to save project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Projects</h2>
        <p>Add your personal projects</p>
        <form onSubmit={onSave} className="mt-7">
          {projectsList.map((item, index) => (
            <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-3 pt-10 rounded-lg relative'>
              <div>
                <label htmlFor={`project-title-${index}`} className='text-xs'>Project Title</label>
                <Input
                  id={`project-title-${index}`}
                  name='title'
                  value={item.title}
                  onChange={(event) => handleChange(index, event)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`tech-stack-${index}`} className='text-xs'>Tech Stack</label>
                <Input
                  id={`tech-stack-${index}`}
                  name='techStack'
                  value={item.techStack}
                  onChange={(event) => handleChange(index, event)}
                />
              </div>
              <div className='col-span-2'>
                <div className="flex justify-between items-end mb-2">
                    <label className='text-xs'>Project Description</label>
                    <Button
                        onClick={() => generateDescriptionFromAI(index)}
                        variant="outline"
                        className="text-primary border-primary flex gap-2"
                        type="button"
                        size="sm"
                        disabled={aiLoadingIndex === index || !item.title}
                    >
                        <Brain className="h-4 w-4" />
                        {aiLoadingIndex === index ? 'Generating...' : 'Generate from AI'}
                        {aiLoadingIndex === index && <LoaderCircle className="animate-spin h-4 w-4" />}
                    </Button>
                </div>
                <RichTextEditor
                  index={index}
                  name={'description'}
                  value={item.description}
                  onRichTextEditorChange={(value, name, index) => handleRichTextEditorChange(value, name, index)}
                />
              </div>
              <div className='col-span-2'>
                <label htmlFor={`project-link-${index}`} className='text-xs'>Project Link (URL)</label>
                <Input
                  id={`project-link-${index}`}
                  type="url"
                  name='link'
                  value={item.link}
                  onChange={(event) => handleChange(index, event)}
                />
              </div>

              {projectsList.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                  onClick={() => removeProject(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <div className='flex justify-between mt-5'>
            <Button onClick={addNewProject} variant='outline' className='text-primary flex gap-2' type="button">
              <PlusCircle className="h-4 w-4" /> Add More Project
            </Button>
            <Button type="submit" disabled={loading || aiLoadingIndex !== null}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save Projects'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}