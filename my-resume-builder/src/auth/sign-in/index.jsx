import { SignIn } from "@clerk/clerk-react";
import '../../index.css';
 export default function SignInPage()
 {
    return(
        
        <div className='flex justify-center my-10'>
            <SignIn/>
        </div>
    )
 }