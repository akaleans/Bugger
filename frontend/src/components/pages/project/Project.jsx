import "./project.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomModal from "../../muiComponents/CustomModal";
import { useState, useEffect } from "react";
import axios from "axios";
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import SmallUserList from "../userList/SmallUserList";
import PersonIcon from '@mui/icons-material/Person';

export default function Project() {
    
    const location = useLocation()

    const project = {
        id: location.state.id,
        name: '',
        description: '',
        date_created: '',
        users: [],
        tickets: [],
    }

    const [dataLoaded, setDataLoaded] = useState("");
    const [projectData, setProjectData] = useState(project)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-project/'+project.id)
        .then((res) => {
            setProjectData(res.data);
            setDataLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => setShow(false);

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Project Updated");
    const setTitleFailed = () => setTitle("Failed to Update Project");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Project Information Update Successful");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered...");

    const handleProjectNameChange = (e) => {
        projectData.name = e.target.value;
    }

    const handleDescriptionChange = (e) => {
        projectData.description = e.target.value;
    }

    const date = new Date(projectData.date_created)

    const handleUpdateProjectButton = () => {
        axios.put('http://localhost:8000/api/update-project/'+project.id, projectData)
        .then((res) => {
            setTitleSuccess();
            setDescSuccess();
            modalOpen();
            setDataLoaded(false)
        })
        .catch((err) => {
            console.log(err);
            setTitleFailed();
            setDescFailed();
            modalOpen();
        });
    }

    const updatedProjectUsers = () => {
        setDataLoaded(false)
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
                Edit Project
                <div className="userBannerDescription">
                    Edit selected project or create new
                    <Link to='/create-project'>
                        <button className="userAddButton">Create Project</button>
                    </Link>
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                    <div className="userDisplay">
                        <h3 className="userDisplayTitle">
                            Project Information
                        </h3>
                        <ul className="userInformationList">
                            <li className="userInformationListItem">
                                <WorkIcon className="userInformationIcon"/>
                                {projectData.name}
                            </li>
                            <li className="userInformationListItem">
                                <DescriptionIcon className="userInformationIcon"/>
                                {projectData.description}
                            </li>
                            <li className="userInformationListItem">
                                <EventIcon className="userInformationIcon"/>
                                Created - {date.toLocaleString()}
                            </li>
                        </ul>
                        <h3 className="userDisplayTitle">
                            Assigned Developers
                        </h3>
                        <ul className="userInformationList">
                            {projectData.users.map(user => {
                                return (
                                    <li className="userInformationListItem" key={user.id}>
                                        <PersonIcon className="userInformationIcon"/>
                                        {user.first_name} {user.last_name}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="userUpdate">
                        <div className="userUpdateLeftSide">
                            <span className="userUpdateTitle">Edit</span>
                            <form action="" className="userUpdateForm">
                                <div className="userUpdateItem">
                                    <label>Project Name</label>
                                    <input 
                                        type="text" 
                                        placeholder={projectData.name}
                                        onChange={handleProjectNameChange}
                                        >
                                    </input>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Project Description</label>
                                    <input 
                                        type="text" 
                                        placeholder={projectData.description}
                                        onChange={handleDescriptionChange}
                                        >
                                    </input>
                                </div>
                            </form>
                            <div className="userUpdateRightSide">
                                <button className="userAddButton" onClick={ () => {
                                    handleUpdateProjectButton()
                                }}>
                                    Update Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {dataLoaded ? <SmallUserList projectData={projectData} updatedUsers={updatedProjectUsers} /> : null}
                </div>
            </div>
        </div>
    )
}
