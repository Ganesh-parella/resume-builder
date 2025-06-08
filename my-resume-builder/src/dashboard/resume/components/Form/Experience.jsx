import React, { useState, useContext, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle, PlusCircle, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';
import { generateFromAI } from '../../../../../services/AIModel';

// Helper function to format dates from various strings (like "Jan 2020", "2020-01-01")
// to 'YYYY-MM-DD' format required by HTML date inputs.
const formatDateForInput = (dateString) => {
    if (!dateString || dateString.toLowerCase() === 'present') {
        return ''; // HTML date input cannot display "Present", so return empty
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Attempt to parse common "Mon YYYY" format if direct parsing fails
            const parts = dateString.split(' ');
            if (parts.length === 2 && parts[1].match(/^\d{4}$/)) { // e.g., "Jan 2020"
                const monthMap = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };
                const monthNum = monthMap[parts[0]];
                if (monthNum) {
                    return `${parts[1]}-${monthNum}-01`; // Default to 1st of the month
                }
            }
            // If it's just a year, e.g., "2020"
            const year = parseInt(dateString, 10);
            if (!isNaN(year) && String(year).length === 4) {
                return `${year}-01-01`; // Default to Jan 1st of that year
            }
            return ''; // Fallback for unparseable dates
        }
        return date.toISOString().split('T')[0]; // Converts to "YYYY-MM-DD"
    } catch (e) {
        console.error("Error formatting date for input:", dateString, e);
        return '';
    }
};

// Helper function to format dates back for storage (e.g., "YYYY-MM" or "Present")
// Adjust this based on what your backend (e.g., Strapi) prefers for date storage.
const formatDateForStorage = (dateString, isCurrentlyWorking = false) => {
    if (isCurrentlyWorking) {
        return 'Present'; // Store "Present" if the user is currently working
    }
    if (!dateString) return '';

    // If your backend expects "YYYY-MM" format (like the dummy data implies for a date range)
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // If it's just a year, e.g., "2020"
            const year = parseInt(dateString, 10);
            if (!isNaN(year) && String(year).length === 4) {
                return String(year);
            }
            return dateString; // Return original if invalid
        }
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } catch (e) {
        console.error("Error formatting date for storage:", dateString, e);
        return dateString; // Fallback to original
    }
};

// Define the initial structure for a single experience entry
const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    workSummary: ''
};

export default function Experience({ enableNext }) {
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [experienceList, setExperienceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

    const hasInitializedFromResumeInfo = useRef(false);

    // Effect 1: Initialize `experienceList` state from `resumeInfo`
    // This is the CRITICAL part that needs to handle JSON string parsing.
    useEffect(() => {
        if (resumeInfo && !hasInitializedFromResumeInfo.current) {
            let parsedExperience = [];
            if (typeof resumeInfo.experience === 'string' && resumeInfo.experience) {
                try {
                    parsedExperience = JSON.parse(resumeInfo.experience);
                } catch (e) {
                    console.error("Failed to parse experience JSON string from context in Experience.jsx:", e);
                    parsedExperience = [];
                }
            } else if (Array.isArray(resumeInfo.experience)) {
                parsedExperience = resumeInfo.experience;
            }

            if (parsedExperience.length > 0) {
                const formattedExperience = parsedExperience.map((exp) => ({
                    ...exp,
                    startDate: formatDateForInput(exp.startDate),
                    endDate: exp.currentlyWorking ? '' : formatDateForInput(exp.endDate),
                    currentlyWorking: exp.currentlyWorking || false,
                }));
                setExperienceList(formattedExperience);
            } else {
                setExperienceList([formField]); // Initialize with one empty field if no data
            }
            hasInitializedFromResumeInfo.current = true;
        } else if (!resumeInfo && !hasInitializedFromResumeInfo.current) {
            setExperienceList([formField]);
            hasInitializedFromResumeInfo.current = true;
        }
    }, [resumeInfo]); // Dependency: re-run if `resumeInfo` changes

    // Effect 2: Sync local `experienceList` state back to `resumeInfo` context
    useEffect(() => {
        if (!hasInitializedFromResumeInfo.current) {
            return;
        }

        const experienceListForContext = experienceList.map(exp => ({
            ...exp,
            startDate: formatDateForStorage(exp.startDate, false),
            endDate: formatDateForStorage(exp.endDate, exp.currentlyWorking),
        }));

        // Get the current experience data from context, handling string parsing for comparison
        let currentContextExperience = [];
        if (resumeInfo?.experience && typeof resumeInfo.experience === 'string') {
            try {
                currentContextExperience = JSON.parse(resumeInfo.experience);
            } catch (e) {
                console.error("Failed to parse experience JSON string from resumeInfo context for comparison in Experience.jsx:", e);
                currentContextExperience = [];
            }
        } else if (Array.isArray(resumeInfo?.experience)) {
            currentContextExperience = resumeInfo.experience;
        }

        // Compare stringified versions for deep equality to avoid unnecessary context updates
        const areContentsEqual = JSON.stringify(experienceListForContext) === JSON.stringify(currentContextExperience);

        if (!areContentsEqual) {
            setResumeInfo(prev => ({
                ...prev,
                experience: experienceListForContext,
            }));
            if (enableNext) enableNext(false);
        }
    }, [experienceList, setResumeInfo, resumeInfo?.experience]);


    const handleChange = (index, event) => {
        const { name, value, checked } = event.target;
        const newEntries = [...experienceList];

        if (name === 'currentlyWorking') {
            newEntries[index] = {
                ...newEntries[index],
                currentlyWorking: checked,
                endDate: checked ? '' : newEntries[index].endDate // Clear endDate if checked, keep existing if unchecked
            };
        } else {
            newEntries[index][name] = value;
        }
        setExperienceList(newEntries);
        if (enableNext) enableNext(false);
    };

    const addNewExperience = () => {
        setExperienceList([...experienceList, { ...formField }]);
        if (enableNext) enableNext(false);
    };

    const removeExperience = (indexToRemove) => {
        if (experienceList.length > 1) {
            setExperienceList(experienceList.filter((_, index) => index !== indexToRemove));
            if (enableNext) enableNext(false);
        } else {
            toast.error("You must have at least one work experience.");
        }
    };

    const handleRichTextEditorChange = (value, name, index) => {
        const newEntries = [...experienceList];
        newEntries[index][name] = value;
        setExperienceList(newEntries);
        if (enableNext) enableNext(false);
    };

    const generateSummaryFromAI = async (index) => {
        setAiLoadingIndex(index);
        if (enableNext) enableNext(false);

        const experience = experienceList[index];
        const prompt = `
            Generate 2-3 professional bullet points for the work summary/responsibilities section of a resume.
            The role is "${experience.title || 'Software Developer'}" at "${experience.companyName || 'A Company'}".
            Focus on quantifiable achievements and key contributions.
            Return the summary as a single string with each bullet point on a new line (use hyphens or asterisks for bullets).
            Do NOT include any additional text, preamble, or formatting outside of the bullet points.
        `;

        try {
            const generatedText = await generateFromAI(prompt);
            const updatedList = experienceList.map((exp, i) =>
                i === index ? { ...exp, workSummary: generatedText.trim() } : exp
            );
            setExperienceList(updatedList);
            toast.success('Responsibilities generated from AI!');
        } catch (err) {
            console.error('AI generation error:', err);
            toast.error('Failed to generate responsibilities. Please check your API setup.');
        } finally {
            setAiLoadingIndex(null);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (enableNext) enableNext(false);

        const isValid = experienceList.every(exp =>
            exp.title.trim() !== '' &&
            exp.companyName.trim() !== '' &&
            exp.startDate.trim() !== '' &&
            (exp.currentlyWorking || exp.endDate.trim() !== '')
        );

        if (!isValid) {
            toast.error('Please fill out Job Title, Company Name, Start Date, and either End Date or select "Currently Working here" for all entries.');
            setLoading(false);
            return;
        }

        const experienceListForSave = experienceList.map(exp => ({
            ...exp,
            startDate: formatDateForStorage(exp.startDate, false),
            endDate: formatDateForStorage(exp.endDate, exp.currentlyWorking),
        }));

        try {
            const data = {
                data: {
                    experience: JSON.stringify(experienceListForSave), // Stringify the array for Strapi
                },
            };
            console.log(data);
            await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
            if (enableNext) enableNext(true);
            toast.success('Experience details updated successfully!');
        } catch (err) {
            console.error('Error saving experience:', err);
            toast.error('Failed to save experience. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
                <h2 className="font-bold text-lg">Work Experience</h2>
                <p>Add your previous job experience</p>
                <form onSubmit={onSave} className="mt-7">
                    {experienceList.map((item, index) => (
                        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-3 pt-10 rounded-lg relative'>
                            <div>
                                <label htmlFor={`title-${index}`} className='text-xs'>Position Title</label>
                                <Input
                                    id={`title-${index}`}
                                    name='title'
                                    value={item.title}
                                    onChange={(event) => handleChange(index, event)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor={`companyName-${index}`} className='text-xs'>Company Name</label>
                                <Input
                                    id={`companyName-${index}`}
                                    name='companyName'
                                    value={item.companyName}
                                    onChange={(event) => handleChange(index, event)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor={`city-${index}`} className='text-xs'>City</label>
                                <Input
                                    id={`city-${index}`}
                                    name='city'
                                    value={item.city}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div>
                                <label htmlFor={`state-${index}`} className='text-xs'>State</label>
                                <Input
                                    id={`state-${index}`}
                                    name='state'
                                    value={item.state}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div>
                                <label htmlFor={`startDate-${index}`} className='text-xs'>Start Date</label>
                                <Input
                                    id={`startDate-${index}`}
                                    type="date"
                                    name='startDate'
                                    value={item.startDate}
                                    onChange={(event) => handleChange(index, event)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor={`endDate-${index}`} className='text-xs'>End Date</label>
                                <Input
                                    id={`endDate-${index}`}
                                    type="date"
                                    name='endDate'
                                    value={item.endDate}
                                    onChange={(event) => handleChange(index, event)}
                                    required={!item.currentlyWorking}
                                    disabled={item.currentlyWorking}
                                />
                            </div>
                            <div className="flex items-center mt-2 col-span-2">
                                <input
                                    type="checkbox"
                                    name="currentlyWorking"
                                    checked={item.currentlyWorking}
                                    onChange={(event) => handleChange(index, event)}
                                    className="mr-2"
                                    id={`currentlyWorking-${index}`}
                                />
                                <label htmlFor={`currentlyWorking-${index}`} className="text-sm">Currently Working here</label>
                            </div>
                            <div className='col-span-2'>
                                <div className="flex justify-between items-end mb-2">
                                    <label className='text-xs'>Work Summary</label>
                                    <Button
                                        onClick={() => generateSummaryFromAI(index)}
                                        variant="outline"
                                        className="text-primary border-primary flex gap-2"
                                        type="button"
                                        size="sm"
                                        disabled={aiLoadingIndex === index || !item.title || !item.companyName}
                                    >
                                        <Brain className="h-4 w-4" />
                                        {aiLoadingIndex === index ? 'Generating...' : 'Generate from AI'}
                                        {aiLoadingIndex === index && <LoaderCircle className="animate-spin h-4 w-4" />}
                                    </Button>
                                </div>
                                <RichTextEditor
                                    index={index}
                                    name={'workSummary'}
                                    value={item.workSummary}
                                    onRichTextEditorChange={(value, name, index) => handleRichTextEditorChange(value, name, index)}
                                />
                            </div>
                            {experienceList.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                    onClick={() => removeExperience(index)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <div className='flex justify-between mt-5'>
                        <div className='flex gap-2'>
                            <Button onClick={addNewExperience} variant='outline' className='text-primary flex gap-2' type="button">
                                <PlusCircle className="h-4 w-4" /> Add More Experience
                            </Button>
                        </div>
                        <Button type="submit" disabled={loading || aiLoadingIndex !== null}>
                            {loading ? <LoaderCircle className="animate-spin" /> : 'Save Experience'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}