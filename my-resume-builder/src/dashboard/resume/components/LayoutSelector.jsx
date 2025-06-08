// src/components/dashboard/builder/LayoutSelector.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '../../../../services/GlobalApi'; // Adjust path as needed
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function LayoutSelector() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  // Define the layouts that are balanced and consider Exp, Projects, Certs
  const layouts = [
    {
      name: 'Default (Left Sidebar)',
      value: 'default',
      description: 'Standard 2-column with left sidebar for skills & contact. Uses HRs.'
    },
    {
      name: 'Top Header & 2-Column',
      value: 'layout-top-summary',
      description: 'Personal details & summary span full width, then 2 columns. Uses HRs.'
    },
    {
      name: 'Right Sidebar',
      value: 'layout-right-sidebar',
      description: 'Reversed 2-column with right sidebar for skills & contact. Uses HRs.'
    },
    {
      name: 'Experiential Focus',
      value: 'layout-experiential-focus',
      description: 'Experience and projects grouped prominently on the left. Uses HRs.'
    },
    {
      name: 'Two Column Equal',
      value: 'layout-two-column-equal',
      description: 'Personal/summary at top, then content split evenly into two columns. Uses HRs.'
    },
    {
      name: 'Main Content Centric',
      value: 'layout-main-content-centric',
      description: 'Compact personal top, then main content (exp, proj, certs) on left. No HRs.'
    },
    {
      name: 'Clean Sectioned',
      value: 'layout-clean-sectioned',
      description: 'Single column with prominent HRs between all major sections. Uses HRs.'
    },
    // You can uncomment/add other layouts from your previous list if you want more options
    // {
    //   name: 'Single Column Minimal',
    //   value: 'layout-single-column-minimal',
    //   description: 'All sections stacked vertically, relies on spacing, no HRs.'
    // },
  ];

  const onLayoutSelect = async (layoutValue) => {
    setLoading(true);
    setOpenPopover(false);

    setResumeInfo(prev => ({
      ...prev,
      layout: layoutValue
    }));

    const data = {
      data: {
        layout: layoutValue
      }
    };

    try {
      await GlobalApi.UpdateResumeDetail(resumeId, data);
      toast.success('Resume layout updated successfully!');
    } catch (error) {
      console.error('Error updating resume layout:', error);
      toast.error('Failed to update layout. Please try again.');
      setResumeInfo(prev => ({
        ...prev,
        layout: resumeInfo.layout
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: any initial logic based on resumeInfo?.layout
  }, [resumeInfo]);

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2" disabled={loading}>
          Layout <LayoutGrid className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <h3 className="font-bold text-lg mb-2">Choose Layout</h3>
        <div className="grid gap-2">
          {layouts.map((layout) => (
            <div
              key={layout.value}
              className={`
                p-2 border rounded-md cursor-pointer
                ${resumeInfo?.layout === layout.value ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-gray-200'}
                hover:bg-muted/50 transition-colors
              `}
              onClick={() => onLayoutSelect(layout.value)}
            >
              <h4 className="font-semibold text-sm">{layout.name}</h4>
              <p className="text-xs text-muted-foreground">{layout.description}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}