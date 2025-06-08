import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, PlusCircle, XCircle } from 'lucide-react';

export default function HobbiesLanguages({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [hobbiesList, setHobbiesList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const hasInitializedFromResumeInfo = useRef(false);

  useEffect(() => {
    if (resumeInfo && !hasInitializedFromResumeInfo.current) {
      if (resumeInfo.hobbies && resumeInfo.hobbies.length > 0) {
        // Hobbies are stored as JSON string in Strapi, so parse it
        const parsedHobbies = typeof resumeInfo.hobbies === 'string'
          ? JSON.parse(resumeInfo.hobbies)
          : resumeInfo.hobbies;
        setHobbiesList(parsedHobbies);
      }
      if (resumeInfo.languages && resumeInfo.languages.length > 0) {
        // Languages are stored as JSON string in Strapi, so parse it
        const parsedLanguages = typeof resumeInfo.languages === 'string'
          ? JSON.parse(resumeInfo.languages)
          : resumeInfo.languages;
        setLanguagesList(parsedLanguages);
      }
      hasInitializedFromResumeInfo.current = true;
    }
  }, [resumeInfo]);

  useEffect(() => {
    if (!hasInitializedFromResumeInfo.current) {
      return;
    }

    const currentContextHobbies = resumeInfo?.hobbies && typeof resumeInfo.hobbies === 'string'
      ? JSON.parse(resumeInfo.hobbies)
      : resumeInfo?.hobbies || [];
    const currentContextLanguages = resumeInfo?.languages && typeof resumeInfo.languages === 'string'
      ? JSON.parse(resumeInfo.languages)
      : resumeInfo?.languages || [];

    const hobbiesChanged = JSON.stringify(hobbiesList) !== JSON.stringify(currentContextHobbies);
    const languagesChanged = JSON.stringify(languagesList) !== JSON.stringify(currentContextLanguages);

    if (hobbiesChanged || languagesChanged) {
      setResumeInfo(prev => ({
        ...prev,
        hobbies: hobbiesList,
        languages: languagesList,
      }));
    }
  }, [hobbiesList, languagesList, setResumeInfo, resumeInfo?.hobbies, resumeInfo?.languages]);

  const addHobby = () => {
    const trimmedHobby = newHobby.trim();
    if (trimmedHobby && !hobbiesList.some(hobby => hobby.toLowerCase() === trimmedHobby.toLowerCase())) {
      setHobbiesList([...hobbiesList, trimmedHobby]);
      setNewHobby('');
      if (enableNext) enableNext(false);
    } else if (trimmedHobby) {
      toast.info('Hobby already exists!');
    }
  };

  const removeHobby = (hobbyToRemove) => {
    setHobbiesList(hobbiesList.filter(hobby => hobby !== hobbyToRemove));
    if (enableNext) enableNext(false);
  };

  const addLanguage = () => {
    const trimmedLanguage = newLanguage.trim();
    if (trimmedLanguage && !languagesList.some(lang => lang.toLowerCase() === trimmedLanguage.toLowerCase())) {
      setLanguagesList([...languagesList, trimmedLanguage]);
      setNewLanguage('');
      if (enableNext) enableNext(false);
    } else if (trimmedLanguage) {
      toast.info('Language already exists!');
    }
  };

  const removeLanguage = (langToRemove) => {
    setLanguagesList(languagesList.filter(lang => lang !== langToRemove));
    if (enableNext) enableNext(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (enableNext) enableNext(false);

    try {
      const data = {
        data: {
          hobbies: JSON.stringify(hobbiesList), // Stringify the array for Strapi
          languages: JSON.stringify(languagesList), // Stringify the array for Strapi
        },
      };

      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      if (enableNext) enableNext(true);
      toast.success('Hobbies and Languages updated successfully!');
    } catch (err) {
      console.error('Error saving hobbies and languages:', err);
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Hobbies & Interests</h2>
        <p>List your hobbies and interests</p>
        <form onSubmit={onSave} className="mt-7">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="text"
                placeholder="Add a new hobby"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (addHobby(), e.preventDefault())}
              />
              <Button type="button" onClick={addHobby}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Hobby
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbiesList.map((hobby, index) => (
                <Badge
                  key={index}
                  className="bg-gray-200 text-gray-800 p-2 px-3 flex items-center gap-1 cursor-pointer"
                  onClick={() => removeHobby(hobby)}
                >
                  {hobby}
                  <XCircle className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <hr className="my-6 border-t border-gray-200" />

          <h2 className="font-bold text-lg">Languages</h2>
          <p>List the languages you speak</p>
          <div className="flex items-center gap-2 mb-4 mt-4">
            <Input
              type="text"
              placeholder="Add a new language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (addLanguage(), e.preventDefault())}
            />
            <Button type="button" onClick={addLanguage}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Language
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {languagesList.map((lang, index) => (
              <Badge
                key={index}
                className="bg-gray-200 text-gray-800 p-2 px-3 flex items-center gap-1 cursor-pointer"
                onClick={() => removeLanguage(lang)}
              >
                {lang}
                <XCircle className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>

          <div className='flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save All'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}