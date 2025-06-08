import { Link, useNavigate, useNavigation } from "react-router-dom"; // Make sure this is imported
import { Button } from "../button";
import { UserButton, useUser } from "@clerk/clerk-react";

export const Header = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate=useNavigate();
  return (
    <div className="p-3 px-5 py-5 flex justify-between shadow-md items-center">
      <img src="/logo.svg" alt="logo" onClick={()=>navigate('/')} width={100} height={100} />

      {isSignedIn ? (
        <div className="flex gap-2 items-center">
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
};
