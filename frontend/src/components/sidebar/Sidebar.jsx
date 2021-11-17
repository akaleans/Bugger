import "./sidebar.css";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SubjectIcon from '@mui/icons-material/Subject';
import BugReportIcon from '@mui/icons-material/BugReport';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">
                        Dashboard
                    </h3>
                    <div className="sidebarList">
                        {/* <OldSchoolMenuLinkHome activeOnlyWhenExact={true} to="/"/> */}
                        <NavLink 
                            exact to={"/"} 
                            className="sidebarListItem" 
                            activeClassName="active-link"
                            style={{ 
                                color: 'inherit', 
                                textDecoration: 'inherit'}}>
                            <DashboardIcon className="sidebarIcon"/>
                            Home
                        </NavLink>
                        <NavLink 
                            to={"/projects"} 
                            className="sidebarListItem" 
                            activeClassName="active-link"
                            style={{ 
                                color: 'inherit', 
                                textDecoration: 'inherit'}}>
                            <SubjectIcon className="sidebarIcon"/>
                            Projects
                        </NavLink>
                        <NavLink 
                            to={"/tickets"} 
                            className="sidebarListItem" 
                            activeClassName="active-link"
                            style={{ 
                                color: 'inherit', 
                                textDecoration: 'inherit'}}>
                            <BugReportIcon className="sidebarIcon"/>
                            Tickets
                        </NavLink>
                        <NavLink 
                            to={"/users"} 
                            className="sidebarListItem" 
                            activeClassName="active-link"
                            style={{ 
                                color: 'inherit', 
                                textDecoration: 'inherit'}}>
                            <PeopleIcon className="sidebarIcon"/>
                            Users
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
