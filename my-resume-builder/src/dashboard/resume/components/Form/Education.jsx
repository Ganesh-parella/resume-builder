// Education.jsx

import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '../RichTextEditor'; // Ensure this path is correct
import { ResumeInfoContext } from '@/context/ResumeInfoContext'; // Ensure this path is correct
import { Brain, LoaderCircle, PlusCircle, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi'; // Ensure this path is correct
import { toast } from 'sonner';
import { generateFromAI } from '../../../../../services/AIModel'; // Ensure this path is correct


// Helper function to format dates from various strings (like "2013")
// to 'YYYY-MM-DD' format required by HTML date inputs for consistency.
const formatDateForInputEdu = (yearString) => {
    if (!yearString) return '';
    const year = parseInt(yearString, 10);
    if (isNaN(year) || year < 1000 || year > 3000) return ''; // Basic year validation
    // HTML date input expects 'YYYY-MM-DD'. Default to Jan 1st of that year.
    return `${year}-01-01`;
};

// Helper function to format dates back for storage (e.g., "YYYY")
const formatDateForStorageEdu = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Check if date is valid (e.g., '2023-01-01' will parse, 'invalid' won't)
        if (isNaN(date.getTime())) {
            // If it's not a valid date string but might be a year string already
            const year = parseInt(dateString, 10);
            if (!isNaN(year) && year >= 1000 && year <= 3000) {
                return String(year); // Return as string "YYYY"
            }
            return dateString; // Return original if it can't be parsed or is an invalid year
        }
        return `${date.getFullYear()}`; // Store only the year
    } catch (e) {
        console.error("Error formatting date for education storage:", dateString, e);
        return dateString; // Fallback: return original string if error occurs
    }
};

// Initial structure for a single education entry
const formField = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '', // Will be handled by date input but stored as year
    endDate: '',   // Will be handled by date input but stored as year
    description: '' // This will be handled by RichTextEditor
};

export default function Education({ enableNext }) {
    const params = useParams(); // To get resumeId from URL
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    // State to manage the list of education entries in the form
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(false); // For save button loading state
    const [aiLoadingIndex, setAiLoadingIndex] = useState(null); // For AI generation button loading state

    // Ref to prevent re-initializing educationList if resumeInfo changes multiple times
    const hasInitializedFromResumeInfo = useRef(false);

    // Effect to initialize educationList from resumeInfo context
    useEffect(() => {
        // Only initialize if resumeInfo is available and hasn't been initialized yet
        if (resumeInfo && !hasInitializedFromResumeInfo.current) {
            let educationData = [];
            // Check if resumeInfo.education is a string (from Strapi JSON)
            if (typeof resumeInfo.education === 'string' && resumeInfo.education) {
                try {
                    educationData = JSON.parse(resumeInfo.education);
                } catch (e) {
                    console.error("Failed to parse education JSON string from context:", e);
                    educationData = []; // Fallback to empty array if parsing fails
                }
            } else if (Array.isArray(resumeInfo.education)) {
                // If it's already an array (e.g., from dummy data or previous state)
                educationData = resumeInfo.education;
            }

            if (educationData.length > 0) {
                // Format dates for display in HTML date inputs (YYYY-MM-DD)
                const formattedEducation = educationData.map((edu) => ({
                    ...edu,
                    startDate: formatDateForInputEdu(edu.startDate),
                    endDate: formatDateForInputEdu(edu.endDate),
                }));
                setEducationList(formattedEducation);
            } else {
                // If no education data, add one empty form field
                setEducationList([formField]);
            }
            hasInitializedFromResumeInfo.current = true; // Mark as initialized
        } else if (!resumeInfo && !hasInitializedFromResumeInfo.current) {
            // If resumeInfo is not yet available, initialize with one empty field
            setEducationList([formField]);
            hasInitializedFromResumeInfo.current = true;
        }
    }, [resumeInfo]); // Dependency on resumeInfo

    // Effect to update resumeInfoContext whenever educationList changes
    useEffect(() => {
        // Prevent updating context immediately on initial load before component is ready
        if (!hasInitializedFromResumeInfo.current) {
            return;
        }

        // Prepare educationList for context/storage by formatting dates back to year
        const educationListForContext = educationList.map(edu => ({
            ...edu,
            startDate: formatDateForStorageEdu(edu.startDate),
            endDate: formatDateForStorageEdu(edu.endDate),
        }));

        // Get current education from context, handling string parsing
        let currentContextEducation = [];
        if (resumeInfo?.education && typeof resumeInfo.education === 'string') {
            try {
                currentContextEducation = JSON.parse(resumeInfo.education);
            } catch (e) {
                console.error("Failed to parse education JSON string from resumeInfo context for comparison:", e);
                currentContextEducation = [];
            }
        } else if (Array.isArray(resumeInfo?.education)) {
            currentContextEducation = resumeInfo.education;
        }

        // Deep compare to avoid unnecessary context updates and re-renders
        // Note: JSON.stringify is a simple deep comparison, suitable for simple objects.
        // For complex scenarios, consider a dedicated deep-equality library.
        const areContentsEqual = JSON.stringify(educationListForContext) === JSON.stringify(currentContextEducation);

        if (!areContentsEqual) {
            setResumeInfo(prev => ({
                ...prev,
                education: educationListForContext, // Update context with the array
            }));
            if (enableNext) enableNext(false); // Indicate changes, so save button needs to be pressed
        }
    }, [educationList, setResumeInfo, resumeInfo?.education]); // Dependencies

    // Handler for input field changes
    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newEntries = [...educationList]; // Create a shallow copy
        newEntries[index][name] = value; // Update the specific field
        setEducationList(newEntries); // Update state
        if (enableNext) enableNext(false); // Disable next button until saved
    };

    // Handler for RichTextEditor changes
    const handleRichTextEditorChange = (value, name, index) => {
        const newEntries = [...educationList];
        newEntries[index][name] = value;
        setEducationList(newEntries);
        if (enableNext) enableNext(false);
    };

    // Adds a new empty education entry to the list
    const addNewEducation = () => {
        setEducationList([...educationList, { ...formField }]);
        if (enableNext) enableNext(false);
    };

    // Removes an education entry from the list
    const removeEducation = (indexToRemove) => {
        if (educationList.length > 1) { // Ensure at least one entry remains
            setEducationList(educationList.filter((_, index) => index !== indexToRemove));
            if (enableNext) enableNext(false);
        } else {
            toast.error("You must have at least one education entry.");
        }
    };

    // Generates description using AI
    const generateDescriptionFromAI = async (index) => {
        setAiLoadingIndex(index); // Set loading for this specific entry
        if (enableNext) enableNext(false);

        const education = educationList[index];
        const prompt = `
            Generate a 2-3 sentence concise description for an education entry on a resume.
            The degree is "${education.degree || 'A Degree'}" in "${education.major || 'A Major'}" from "${education.universityName || 'A University'}".
            Mention key academic achievements or relevant coursework if implied.
            Do NOT include any additional text, preamble, or formatting outside of the description.
        `;

        try {
            const generatedText = await generateFromAI(prompt);
            const updatedList = educationList.map((edu, i) =>
                i === index ? { ...edu, description: generatedText.trim() } : edu
            );
            setEducationList(updatedList);
            toast.success('Education description generated from AI!');
        } catch (err) {
            console.error('AI generation error:', err);
            toast.error('Failed to generate description. Please check your AI API setup.');
        } finally {
            setAiLoadingIndex(null); // Reset AI loading state
        }
    };

    // Saves the education data to the backend
    const onSave = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set global loading for save button
        if (enableNext) enableNext(false);

        // Basic validation: ensure all required fields are filled for each entry
        const isValid = educationList.every(edu =>
            edu.universityName.trim() !== '' &&
            edu.degree.trim() !== '' &&
            edu.major.trim() !== '' &&
            edu.startDate.trim() !== '' &&
            edu.endDate.trim() !== ''
        );

        if (!isValid) {
            toast.error('Please fill out all required fields for each education entry.');
            setLoading(false);
            return;
        }

        // Prepare data for saving: format dates back to year and stringify for backend
        const educationListForSave = educationList.map(edu => ({
            ...edu,
            startDate: formatDateForStorageEdu(edu.startDate), // Convert back to year for storage
            endDate: formatDateForStorageEdu(edu.endDate),     // Convert back to year for storage
        }));

        try {
            const data = {
                data: {
                    education: JSON.stringify(educationListForSave), // Stringify the array for Strapi
                },
            };

            await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
            if (enableNext) enableNext(true); // Enable next button if saved successfully
            toast.success('Education details updated successfully!');
        } catch (err) {
            console.error('Error saving education:', err);
            toast.error('Failed to save education details. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
                <h2 className="font-bold text-lg">Education</h2>
                <p>Add your educational background</p>
                <form onSubmit={onSave} className="mt-7">
                    {educationList.map((item, index) => (
                        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-3 pt-10 rounded-lg relative'>
                            {/* University Name */}
                            <div>
                                <label htmlFor={`university-name-${index}`} className='text-xs'>University Name</label>
                                <Input
                                    id={`university-name-${index}`}
                                    name='universityName'
                                    value={item.universityName}
                                    onChange={(event) => handleChange(index, event)}
                                    required
                                />
                            </div>
                            {/* Degree */}
                            <div>
                                <label htmlFor={`degree-${index}`} className='text-xs'>Degree</label>
                                <Input
                                    id={`degree-${index}`}
                                    name='degree'
                                    value={item.degree}
                                    onChange={(event) => handleChange(index, event)}
                                    required
                                />
                            </div>
                            {/* Major */}
                            <div>
                                <label htmlFor={`major-${index}`} className='text-xs'>Major</label>
                                <Input
                                    id={`major-${index}`}
                                    name='major'
                                    value={item.major}
                                    onChange={(event) => handleChange(index, event)}
                             
                                />
                            </div>
                            {/* Start Date */}
                            <div>
                                <label htmlFor={`edu-start-date-${index}`} className='text-xs'>Start Year</label>
                                <Input
                                    id={`edu-start-date-${index}`}
                                    type="date" // Use date input for user convenience
                                    name='startDate'
                                    value={item.startDate}
                                    onChange={(event) => handleChange(index, event)}
                                   
                                />
                            </div>
                            {/* End Date */}
                            <div>
                                <label htmlFor={`edu-end-date-${index}`} className='text-xs'>End Year</label>
                                <Input
                                    id={`edu-end-date-${index}`}
                                    type="date" // Use date input for user convenience
                                    name='endDate'
                                    value={item.endDate}
                                    onChange={(event) => handleChange(index, event)}
                                  
                                />
                            </div>
                            {/* Description (RichTextEditor) */}
                            <div className='col-span-2'>
                                <div className="flex justify-between items-end mb-2">
                                    <label className='text-xs'>Description</label>
                                    <Button
                                        onClick={() => generateDescriptionFromAI(index)}
                                        variant="outline"
                                        className="text-primary border-primary flex gap-2"
                                        type="button" // Important: prevents form submission
                                        size="sm"
                                        disabled={aiLoadingIndex === index || !item.universityName || !item.degree}
                                    >
                                        <Brain className="h-4 w-4" />
                                        {aiLoadingIndex === index ? 'Generating...' : 'Generate from AI'}
                                        {aiLoadingIndex === index && <LoaderCircle className="animate-spin h-4 w-4" />}
                                    </Button>
                                </div>
                                <RichTextEditor
                                    index={index} // Pass index to RichTextEditor for specific item update
                                    name={'description'}
                                    value={item.description}  size="sm"
                                    onRichTextEditorChange={(value, name, idx)  => handleRichTextEditorChange(value, name, idx)}
                                />
                            </div>

                            {/* Remove button (only if more than one entry) */}
                            {educationList.length > 1 && (
                                <Button
                                    type="button" // Important: prevents form submission
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                    onClick={() => removeEducation(index)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {/* Add More Education and Save Buttons */}
                    <div className='flex justify-between mt-5'>
                        <Button onClick={addNewEducation} variant='outline' className='text-primary flex gap-2' type="button">
                            <PlusCircle className="h-4 w-4" /> Add More Education
                        </Button>
                        <Button type="submit" disabled={loading || aiLoadingIndex !== null}>
                            {loading ? <LoaderCircle className="animate-spin" /> : 'Save Education'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}