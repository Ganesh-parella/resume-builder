import React, { PureComponent } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import SignInPage  from './auth/sign-in/index';
import App from './App';
import Home from './Home/Home';

import { Dashboard } from './dashboard';
import EditResume from './dashboard/resume/[resumeId]';
import View from './my-resume';
const router=createBrowserRouter([
    {
        path:'/auth/sign-in',
        element:<SignInPage/>
    },
    {
        path:'/my-resume/:resumeId/view',
        element:<View/>
    },
    {
        element:<App/>,
        children:
           [ {
                path:'/',
                element:<Home/>
            },
            {
                path:'/dashboard',
                element:<Dashboard/>
            },
            {
                path:'/dashboard/resume/:resumeId/edit',
                element:<EditResume/>
            }
        ]
        
    }
])
export default router;