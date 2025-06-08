import { Loader2, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from '../../../services/GlobalApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigation=useNavigate();
  const onCreate = () => {
    const trimmedTitle = resumeTitle.trim();
    if (!trimmedTitle) return;

    setLoading(true);
    const uuid = uuidv4();
    const data = {
      title: trimmedTitle,
      resumeId: uuid,
      userEmail: user?.primaryEmailAddress.emailAddress,
      userName: user?.fullName,
    };

    GlobalApi.CreateNewResume(data)
      .then((resp) => {
        toast.success('Resume created successfully!');
        setLoading(false);
        navigation('/dashboard/resume/'+resp.data.data.documentId+'/edit');
      })
      .catch((error) => {
        console.error('Resume creation failed:', error);
        toast.error('Failed to create resume.');
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        className="p-14 py-24 border items-center
          flex justify-center
          bg-secondary
          rounded-lg h-[280px]
          hover:scale-105 transition-all hover:shadow-md cursor-pointer
          border-dashed"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new Resume
              <Input
                className="my-2"
                placeholder="Ex: Full Stack Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && resumeTitle.trim()) {
                    onCreate();
                  }
                }}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5">
              <Button onClick={() => setOpenDialog(false)} variant="ghost">
                Cancel
              </Button>
              <Button
                disabled={!resumeTitle.trim() || loading}
                onClick={onCreate}
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Create'}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
