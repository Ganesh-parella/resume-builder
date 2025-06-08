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

// Define the initial structure for a single certification entry
const formField = {
  title: '',
  issuer: '',
  year: '',
  description: '' // Optional description for AI generation/user input
};

export default function Certifications({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [certificationsList, setCertificationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

  // Ref to ensure `certificationsList` is initialized from `resumeInfo` only once
  const hasInitializedFromResumeInfo = useRef(false);

  // Effect 1: Initialize `certificationsList` state from `resumeInfo` (e.g., dummy data)
  useEffect(() => {
    if (resumeInfo && !hasInitializedFromResumeInfo.current) {
      if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
        // Certifications are stored as JSON string in Strapi, so parse it
        const parsedCertifications = typeof resumeInfo.certifications === 'string'
          ? JSON.parse(resumeInfo.certifications)
          : resumeInfo.certifications;
        setCertificationsList(parsedCertifications);
      } else {
        setCertificationsList([formField]); // Initialize with one empty field if no data
      }
      hasInitializedFromResumeInfo.current = true;
    } else if (!resumeInfo && !hasInitializedFromResumeInfo.current) {
        // If resumeInfo is initially null/undefined, provide one default empty form
        setCertificationsList([formField]);
        hasInitializedFromResumeInfo.current = true;
    }
  }, [resumeInfo]);

  // Effect 2: Sync local `certificationsList` state back to `resumeInfo` context
  useEffect(() => {
    // Skip on initial mount after Effect 1 has run to prevent immediate loop
    if (!hasInitializedFromResumeInfo.current) {
      return;
    }

    const currentContextCertifications = resumeInfo?.certifications && typeof resumeInfo.certifications === 'string'
      ? JSON.parse(resumeInfo.certifications)
      : resumeInfo?.certifications || [];

    // Compare stringified versions for deep equality to avoid unnecessary context updates
    const areContentsEqual = JSON.stringify(certificationsList) === JSON.stringify(currentContextCertifications);

    if (!areContentsEqual) {
      setResumeInfo(prev => ({
        ...prev,
        certifications: certificationsList,
      }));
    }
  }, [certificationsList, setResumeInfo, resumeInfo?.certifications]);

  // Handles changes to any input field for a certification entry
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...certificationsList];
    newEntries[index][name] = value;
    setCertificationsList(newEntries);
    if (enableNext) enableNext(false); // Signal parent that changes are unsaved
  };

  // This handles changes coming from the RichTextEditor component
  const handleRichTextEditorChange = (value, name, index) => {
    const newEntries = [...certificationsList];
    newEntries[index][name] = value; // Update the description for the specific entry
    setCertificationsList(newEntries);
    if (enableNext) enableNext(false);
  };

  // Adds a new blank certification entry to the list
  const addNewCertification = () => {
    setCertificationsList([...certificationsList, { ...formField }]); // Add a new blank entry using formField
    if (enableNext) enableNext(false);
  };

  // Removes a certification entry from the list
  const removeCertification = (indexToRemove) => {
    if (certificationsList.length > 1) { // Prevent removing the last certification
      setCertificationsList(certificationsList.filter((_, index) => index !== indexToRemove));
      if (enableNext) enableNext(false);
    } else {
      toast.error("You must have at least one certification entry.");
    }
  };

  // Function to generate certification description using AI
  const generateDescriptionFromAI = async (index) => {
    setAiLoadingIndex(index); // Set loading state for this specific AI button
    if (enableNext) enableNext(false); // Disable navigation during AI generation

    const cert = certificationsList[index];
    const prompt = `
      Generate a concise, 1-2 sentence description for a certification on a resume.
      The certification is "${cert.title || 'A Certification'}" issued by "${cert.issuer || 'An Organization'}" in "${cert.year || 'A Year'}".
      Focus on the key skills validated or the significance of the certification.
      Do NOT include any additional text, preamble, or formatting outside of the description.
    `;

    try {
      const generatedText = await generateFromAI(prompt);
      const updatedList = certificationsList.map((c, i) =>
        i === index ? { ...c, description: generatedText.trim() } : c
      );
      setCertificationsList(updatedList);
      toast.success('Certification description generated from AI!');
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Failed to generate description. Please check your AI API setup.');
    } finally {
      setAiLoadingIndex(null); // Reset loading state
    }
  };

  // Handles saving all certification entries to the backend
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (enableNext) enableNext(false);

    const isValid = certificationsList.every(cert =>
      cert.title.trim() !== '' &&
      cert.issuer.trim() !== '' &&
      cert.year.trim() !== ''
    );

    if (!isValid) {
        toast.error('Please fill out Title, Issuer, and Year for all certification entries.');
        setLoading(false);
        return;
    }

    try {
      const data = {
        data: {
          certifications: JSON.stringify(certificationsList), // Send the formatted list to Strapi as a JSON string
        },
      };

      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      if (enableNext) enableNext(true); // Enable "Next" button in parent upon successful save
      toast.success('Certification details updated successfully!');
    } catch (err) {
      console.error('Error saving certifications:', err);
      toast.error('Failed to save certifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Certifications</h2>
        <p>Add your professional certifications</p>
        <form onSubmit={onSave} className="mt-7">
          {certificationsList.map((item, index) => (
            <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-3 pt-10 rounded-lg relative'>
              <div>
                <label htmlFor={`cert-title-${index}`} className='text-xs'>Certification Title</label>
                <Input
                  id={`cert-title-${index}`}
                  name='title'
                  value={item.title}
                  onChange={(event) => handleChange(index, event)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`cert-issuer-${index}`} className='text-xs'>Issuing Body</label>
                <Input
                  id={`cert-issuer-${index}`}
                  name='issuer'
                  value={item.issuer}
                  onChange={(event) => handleChange(index, event)}
                  required
                />
              </div>
              <div className="col-span-2"> {/* Make year span full width if needed, or adjust grid */}
                <label htmlFor={`cert-year-${index}`} className='text-xs'>Year Obtained</label>
                <Input
                  id={`cert-year-${index}`}
                  name='year'
                  type="text" // Use type="text" for flexibility with year format
                  value={item.year}
                  onChange={(event) => handleChange(index, event)}
                  required
                />
              </div>
              <div className='col-span-2'>
                <div className="flex justify-between items-end mb-2">
                    <label className='text-xs'>Description (Optional)</label>
                    <Button
                        onClick={() => generateDescriptionFromAI(index)}
                        variant="outline"
                        className="text-primary border-primary flex gap-2"
                        type="button" // Important to prevent form submission
                        size="sm"
                        disabled={aiLoadingIndex === index || !item.title || !item.issuer}
                    >
                        <Brain className="h-4 w-4" />
                        {aiLoadingIndex === index ? 'Generating...' : 'Generate from AI'}
                        {aiLoadingIndex === index && <LoaderCircle className="animate-spin h-4 w-4" />}
                    </Button>
                </div>
                <RichTextEditor
                  index={index} // Pass index to RichTextEditor
                  name={'description'} // Pass name to RichTextEditor
                  value={item.description} // Pass current value to RichTextEditor
                  onRichTextEditorChange={(value, name, index) => handleRichTextEditorChange(value, name, index)}
                />
              </div>
              {certificationsList.length > 1 && (
                <Button
                  type="button" // Important to prevent form submission
                  variant="outline"
                  size="icon" // Use icon size for a small button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                  onClick={() => removeCertification(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <div className='flex justify-between mt-5'>
            <Button onClick={addNewCertification} variant='outline' className='text-primary flex gap-2' type="button">
              <PlusCircle className="h-4 w-4" /> Add More Certification
            </Button>
            <Button type="submit" disabled={loading || aiLoadingIndex !== null}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save Certifications'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}