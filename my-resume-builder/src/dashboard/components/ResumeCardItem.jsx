import { MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlobalApi from '../../../services/GlobalApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export default function ResumeCardItem({resume,refreshData}) {
    const navigation=useNavigate();
    const [openAlert,setOpenAlert]=useState(false);
    const onDelete=()=>
    {
        GlobalApi.DeleteResumeById(resume.documentId).then(resp=>
        {
          console.log(resp);
          toast("resume deleted");
          refreshData();
          setOpenAlert(false);
        }
        )
    }
  return (
    <div className='rounded-lg  border-primary hover:scale-105 transition-all hover:shadow-md '>
        <Link to={'/dashboard/resume/'+resume.documentId+'/edit'}>
        <div className='bg-secondary flex items-center justify-center h-[280px]
          bg-gradient-to-br from-pink-100 via-purple-500 to-blue-4200 rounded-t-md
         '>
                <Notebook/>
        </div>
        </Link>
        <div className='border p-3 flex justify-between rounded-b-md'>
          <h2 className='text-center my-1'>{resume.title}</h2>
          <DropdownMenu>
  <DropdownMenuTrigger><MoreVertical className='h-4 w-4 cursor-pointer'/></DropdownMenuTrigger>
  <DropdownMenuContent value="bottom" >
    <DropdownMenuItem onClick={()=>navigation('/dashboard/resume/'+resume.documentId+'/edit')}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>navigation(`/my-resume/${resume.documentId}/view`)}>View</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>navigation(`/my-resume/${resume.documentId}/view`)}>Download</DropdownMenuItem>
    <DropdownMenuItem onClick={()=>setOpenAlert(true)}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
        <AlertDialog open={openAlert}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>onDelete()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}
