import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { generateFromAI } from '../../../../../services/AIModel';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { toast } from 'sonner';

export default function SummaryWithOptions({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [summary, setSummary] = useState('');
  const [generatedSummaries, setGeneratedSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (resumeInfo?.summary && resumeInfo.summary !== summary) {
      setSummary(resumeInfo.summary);
    }
  }, [resumeInfo?.summary]);

  useEffect(() => {
    if (resumeInfo?.summary !== summary) {
      setResumeInfo((prev) => ({
        ...prev,
        summary: summary,
      }));
    }
  }, [summary, resumeInfo?.summary, setResumeInfo]);

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    enableNext(false);

    if (!summary || summary.trim() === '') {
      toast.error('Summary cannot be empty. Please write or select one.');
      setLoading(false);
      return;
    }

    try {
      const data = {
        data: {
          summary: summary.trim(),
        },
      };
      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      enableNext(true);
      toast.success('Details updated successfully!');
      setGeneratedSummaries([]);
      setSelectedIndex(null);
    } catch (err) {
      console.error('Error saving summary:', err);
      toast.error('Failed to save summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummaries = async () => {
    setLoading(true);
    setGeneratedSummaries([]);
    setSelectedIndex(null);
    enableNext(false);

    const basePrompt = `Generate a concise professional resume summary for the job title "${
      resumeInfo?.jobTitle || 'Software Developer'
    }". The summary should be 3-4 lines long and directly usable. Do not include any additional text, preamble, or formatting outside of the summary itself.`;

    try {
      const results = [];
      for (let i = 0; i < 3; i++) {
        const generated = await generateFromAI(basePrompt);
        if (typeof generated === 'string' && generated.trim().length > 0) {
          results.push(generated.trim());
        }
      }

      setGeneratedSummaries(results);
      toast.success('Summaries generated successfully! Please select one or write your own.');
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Failed to generate summaries from AI. Check your API setup and network.');
    } finally {
      setLoading(false);
    }
  };

  const selectSummary = (index) => {
    setSelectedIndex(index);
    setSummary(generatedSummaries[index]);
    enableNext(false);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Summary</h2>
      <p>Add a professional summary for your job title</p>
      <form onSubmit={onSave} className="mt-7">
        <div className="flex justify-between items-end mb-4">
          <label className="text-sm font-medium text-gray-700">Your Summary</label>
          <Button
            onClick={handleGenerateSummaries}
            variant="outline"
            className="text-primary border-primary flex gap-2"
            type="button"
            size="sm"
            disabled={loading}
          >
            <Brain className="h-4 w-4" />
            {loading ? 'Generating...' : 'Generate from AI'}
          </Button>
        </div>


        <Textarea
          className="mt-2"
          required
          value={summary || ''}
          onChange={(e) => {
            setSummary(e.target.value);
            setSelectedIndex(null);
            enableNext(false);
          }}
          placeholder="Or edit your summary here"
          rows={5}
        />

        <div className="mt-4 flex justify-end">
          <Button disabled={loading || !summary?.trim()} type="submit">
            {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : 'Save Summary'}
          </Button>
        </div>
      </form>
       {generatedSummaries.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 font-semibold text-gray-700">Choose from AI-generated options:</p>
            <div className="space-y-4">
              {generatedSummaries.map((text, i) => (
                <div
                  key={i}
                  className={`p-3 border rounded-md cursor-pointer transition-all duration-200
                    ${selectedIndex === i ? 'border-primary bg-primary/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'}
                  `}
                  onClick={() => selectSummary(i)}
                >
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}