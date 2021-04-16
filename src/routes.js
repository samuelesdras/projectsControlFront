import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Header from './components/header';
import NotFound from './components/not-found';
import AddActivity from './components/activities/add-activity';
import EditActivity from './components/activities/edit-activity';
import ListActivities from './components/activities/list-activities';
import ViewActivity from './components/activities/view-activity';
import AddProject from './components/projects/add-project';
import EditProject from './components/projects/edit-project';
import ListProjects from './components/projects/list-projects';
import ViewProject from './components/projects/view-project';

const Routes = () => (
    <BrowserRouter>
      <div className="container shadow p-3 mb-5 rounded">
        <Header/>
        <Switch>
            <Route path="/add-project" exact component={AddProject}/>
            <Route path="/edit-project/:id" exact component={EditProject}/>
            <Route path="/view-project/:id" exact component={ViewProject}/>
            <Route path="/project/view-activity" exact component={ViewActivity}/>
            <Route path="/project/add-activity" exact component={AddActivity}/>
            <Route path="/project/activities" exact component={ListActivities}/>
            <Route path="/project/edit-activity" exact component={EditActivity}/>
            <Route path="/" exact component={ListProjects}/>
            
            <Route component={NotFound}/>
        </Switch>
      </div>
    </BrowserRouter>
)

export default Routes