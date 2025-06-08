import React, { useContext, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

export default function ThemeColor() {
 const color = [
  '#1E293B', // Slate (modern dark)
  '#2563EB', // Blue
  '#059669', // Emerald
  '#10B981', // Teal
  '#6B7280', // Cool Gray
  '#F59E0B', // Amber (highlight)
  '#8B5CF6', // Violet
  '#F97316', // Orange (accent)
  '#EF4444', // Red (soft red)
  '#3B82F6', // Bright Blue
  '#14B8A6', // Cyan
  '#4B5563', // Gray
  '#64748B', // Slate Gray
  '#16A34A', // Green
  '#0EA5E9', // Sky Blue
  '#E11D48', // Rose
  '#9333EA', // Deep Purple
  '#7C3AED', // Indigo
  '#EAB308', // Gold (highlight)
  '#6EE7B7'  // Mint Green
];


  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectColor, setSelectColor] = useState(resumeInfo?.ThemeColor || '');

  const onSelectColor = (color) => {
    setSelectColor(color);
    setResumeInfo({ ...resumeInfo, themeColor: color });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          Theme <LayoutGrid />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className='mb-2 text-sm font-bold'>Select theme color</h2>
        <div className='grid grid-cols-5 gap-3'>
          {color.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectColor(item)}
              className={`h-5 w-5 rounded cursor-pointer border ${
                selectColor === item ? 'border-black' : 'border-transparent'
              } hover:border-black`}
              style={{ background: item }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
