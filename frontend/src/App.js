import "./app.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./components/pages/home/Home";
import ProjectList from "./components/pages/projectList/ProjectList";
import UserList from "./components/pages/userList/UserList";
import User from "./components/pages/user/User";
import CreateUser from "./components/pages/user/CreateUser";
import Project from "./components/pages/project/Project";
import TicketList from "./components/pages/ticketList/TicketList";
import Ticket from "./components/pages/ticket/Ticket";
import CreateProject from "./components/pages/project/CreateProject";
import CreateTicket from "./components/pages/ticket/CreateTicket";

function App() {
  return (
    <Router>
      <div className="app">
        <Topbar/>
        <div className="container">
          <Sidebar/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/projects" component={ProjectList}/>
            <Route path="/users" component={UserList}/>
            <Route path="/user/:userId" component={User}/>
            <Route path="/create-user" component={CreateUser}/>
            <Route path="/project/:projectId" component={Project}/>
            <Route path="/create-project/" component={CreateProject}/>
            <Route path="/tickets" component={TicketList}/>
            <Route path="/ticket/:ticketId" component={Ticket}/>
            <Route path="/create-ticket/" component={CreateTicket}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
