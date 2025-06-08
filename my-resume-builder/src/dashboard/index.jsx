import { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/clerk-react";
import GlobalApi from "../../services/GlobalApi";
import ResumeCardItem from "./components/ResumeCardItem";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumeList = () => {
    if (!user) return;

    GlobalApi.GetUserResume(user?.primaryEmailAddress?.emailAddress)
      .then((resp) => {
        setResumeList(resp.data.data);
        console.log("Resumes:", resp.data.data);
      })
      .catch((err) => {
        console.error("Error fetching resumes", err);
      });
  };

  useEffect(() => {
    GetResumeList();
  }, [user]);

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-2xl">My Resume</h2>
      <p>Start creating resumes for your next job role</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
        <AddResume />
        {resumeList.length > 0 &&
          resumeList.map((resume, index) => (
              <ResumeCardItem className="" resume={resume} refreshData={GetResumeList}/>
          ))}
      </div>
    </div>
  );
}
