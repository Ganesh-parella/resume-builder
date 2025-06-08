import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../services/GlobalApi';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PersonalDetailForm({ enableNext }) {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  jobTitle: '',
  address: '',
  phone: '',
  email: ''
});

useEffect(() => {
  setFormData({
    firstName: resumeInfo.firstName || '',
    lastName: resumeInfo.lastName || '',
    jobTitle: resumeInfo.jobTitle || '',
    address: resumeInfo.address || '',
    phone: resumeInfo.phone || '',
    email: resumeInfo.email || ''
  });
}, [resumeInfo]);
  const [loading, setLoading] = useState(false);

  

  const handleInputChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;
   setFormData(prev => ({ ...prev, [name]: value }));
  setResumeInfo(prev => ({ ...prev, [name]: value }));
    
  };
  useEffect(()=>
    {
        console.log(resumeInfo);
    },[]
  )

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
   
    const data = {
      data: formData,
    };
 console.log("Updating resume ID:", params?.resumeId);
console.log("Payload:", data);

GlobalApi.UpdateResumeDetail( params?.resumeId, data)
      .then((resp) => {
        console.log(resp);
        enableNext(true);
        setLoading(false);
        toast("Details updated");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>
      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm" htmlFor="firstName">First Name</label>
            <Input name="firstName" required defaultValue={formData.firstName || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm" htmlFor="lastName">Last Name</label>
            <Input name="lastName" required defaultValue={formData.lastName || ''} onChange={handleInputChange} />
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="jobTitle">Job Title</label>
            <Input name="jobTitle" required defaultValue={formData.jobTitle || ''} onChange={handleInputChange} />
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="address">Address</label>
            <Input name="address" required defaultValue={formData.address || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm" htmlFor="phone">Phone Number</label>
            <Input name="phone" required defaultValue={formData.phone || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm" htmlFor="email">Email</label>
            <Input name="email" required defaultValue={formData.email || ''} onChange={handleInputChange} />
          </div>
          <div className="col-span-2 mt-3 flex justify-end">
            <Button disabled={loading} type="submit">
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
