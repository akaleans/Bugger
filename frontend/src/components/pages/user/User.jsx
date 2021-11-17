import "./user.css"
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomModal from "../../muiComponents/CustomModal";
import { useState, useEffect } from "react";
import axios from "axios";
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function User() {
    const location = useLocation()

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Team Member Updated");
    const setTitleFailed = () => setTitle("Failed to Update Team Member");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Team Member Updated Successfully to Database");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered... Possible duplicate email...");

    const user = {
        id: location.state.id,
        first_name: '',
        last_name: '',
        role: '',
        email: '',
    }

    const projects = [{
        id: location.state.id,
        name: '',
        description: '',
        date_created: '',
        users: [],
        tickets: [],
    }]

    const [projectData, setProjectData] = useState(projects)
    const [userData, setUserData] = useState(user)
    const [dataLoaded, setDataLoaded] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-user/'+user.id)
        .then((res) => {
            setUserData(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
        axios.get('http://localhost:8000/api/get-user-projects/'+user.id)
        .then((res) => {
            setProjectData(res.data);
            console.log(res.data);
            setDataLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

    const handleFirstNameChange = (e) => {
        userData.first_name = e.target.value;
    }

    const handleLastNameChange = (e) => {
        userData.last_name = e.target.value;
    }

    const handleRoleChange = (e) => {
        userData.role = e.target.value;
    }

    const handleEmailChange = (e) => {
        userData.email = e.target.value;
    }

    const handleUpdateUserButton = () => {
        axios.put('http://localhost:8000/api/update-user/'+location.state.id, userData)
        .then((res) => {
            console.log(res);
            setTitleSuccess();
            setDescSuccess();
            modalOpen();
        })
        .catch((err) => {
            console.log(err);
            setTitleFailed();
            setDescFailed();
            modalOpen();
        });
    }

    return (
        <div className="userPage">
            <CustomModal 
                open={show} 
                handleClose={() => modalClose()} 
                title={title} 
                description={desc}
            />
            <span className="userBanner">
                Edit User
                <div className="userBannerDescription">
                    Edit selected developer or create new
                    <Link to='/create-user'>
                        <button className="userAddButton">Create User</button>
                    </Link>
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                        <div className="userDisplay">
                            <h3 className="userDisplayTitle">
                                User Information
                            </h3>
                            <ul className="userInformationList">
                                <li className="userInformationListItem">
                                    <PersonIcon className="userInformationIcon"/>
                                    {userData.first_name} {userData.last_name}
                                </li>
                                <li className="userInformationListItem">
                                    <WorkIcon className="userInformationIcon"/>
                                    {userData.role}
                                </li>
                                <li className="userInformationListItem">
                                    <AlternateEmailIcon className="userInformationIcon"/>
                                    {userData.email}
                                </li>
                            </ul>
                            <h3 className="userDisplayTitle">
                                Assigned Projects
                            </h3>
                            <ul className="userInformationList">
                                {projectData.map(p => {
                                    if(p.name !== ''){
                                        return (
                                            <li className="userInformationListItem" key={p.id}>
                                                <AssignmentIcon className="userInformationIcon"/>
                                                {p.name}
                                            </li>
                                        );
                                    }
                                    else return (
                                        <li className="userInformationListItem">
                                            No Assigned Projects
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    <div className="userUpdate">
                        <div className="userUpdateLeftSide">
                            <span className="userUpdateTitle">Edit</span>
                            <form action="" className="userUpdateForm">
                                <div className="userUpdateItem">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        placeholder={userData.first_name}
                                        onChange={handleFirstNameChange}
                                        >
                                    </input>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        placeholder={userData.last_name}
                                        onChange={handleLastNameChange}
                                        >
                                    </input>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Role</label>
                                    <select selected
                                        type="text"
                                        placeholder={userData.role}
                                        onChange={handleRoleChange}
                                        >
                                        <option value="NULL">Select a Role</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Project Manager">Project Manager</option>
                                        <option value="Team Manager">Team Manager</option>
                                    </select>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Email</label>
                                    <input 
                                        type="text" 
                                        placeholder={userData.email}
                                        onChange={handleEmailChange}
                                        >
                                    </input>
                                </div>
                            </form>
                            <div className="userUpdateRightSide">
                                <button className="userAddButton" onClick={ () => {
                                    handleUpdateUserButton()
                                }}>
                                    Update User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
