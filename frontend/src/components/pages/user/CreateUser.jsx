import axios from "axios";
import CustomModal from "../../muiComponents/CustomModal";
import { useState } from "react";

export default function CreateUser() {
    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Team Member Added");
    const setTitleFailed = () => setTitle("Failed to Add Team Member");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Team Member Added Successfully to Database");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered... Possible duplicate email...");

    const data = {
        first_name: 'first_name',
        last_name: 'last_name',
        role: 'role',
        email: 'email',
    }

    const handleFirstNameChange = (e) => {
        data.first_name = e.target.value;
    }

    const handleLastNameChange = (e) => {
        data.last_name = e.target.value;
    }

    const handleRoleChange = (e) => {
        data.role = e.target.value;
    }

    const handleEmailChange = (e) => {
        data.email = e.target.value;
    }

    const handleAddTeamMemberButton = () => {
        axios.post('http://localhost:8000/api/create-user', data)
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
                Create Team Member
                <div className="userBannerDescription">
                    Add someone to the team
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                        <div className="userDisplay">
                            <h3 className="userDisplayTitle">
                                Team Member Information
                            </h3>
                            <form action="" className="userUpdateForm">
                                <div className="userUpdateItem">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="First Name"
                                        onChange={handleFirstNameChange}
                                        >
                                    </input>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Last Name"
                                        onChange={handleLastNameChange}
                                        >
                                    </input>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Role</label>
                                    <select
                                        type="text"
                                        onChange={handleRoleChange}
                                        >
                                        <option value="Admin">Admin</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Project Manager">Project Manager</option>
                                        <option value="Team Manager">Team Manager</option>
                                    </select>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Email</label>
                                    <input 
                                        type="text" 
                                        placeholder="Email"
                                        onChange={handleEmailChange}
                                        >
                                    </input>
                                </div>
                            </form>
                            <div className="userUpdateRightSide">
                                <button className="userAddButton" onClick={ () => 
                                    handleAddTeamMemberButton()
                                }>
                                    Add Team Member
                                </button>
                            </div>
                        </div>
                    {/* <div className="userUpdate">
                        <div className="userUpdateLeftSide">
                            <span className="userUpdateTitle">Assign Projects</span>
                            <MultipleSelect/>
                            <div className="userUpdateRightSide">
                                <button className="userAddButton" onClick={ () => 
                                    handleAddTeamMemberButton()
                                }>
                                    Add Team Member
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
