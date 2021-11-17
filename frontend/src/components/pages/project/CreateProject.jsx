import axios from "axios";
import CustomModal from "../../muiComponents/CustomModal";
import { useState } from "react";
import CreateProjectUserList from "../userList/CreateProjectUserList";

export default function CreateProject() {

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Project Added");
    const setTitleFailed = () => setTitle("Failed to Add Project");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Project Added Successfully to Database");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered...");

    const data = {
        name: 'name',
        date_created: 'date_created',
        description: 'description',
        users: [],
        tickets: [],
    }

    const pushToUsers = (row) => {
        data.users.push(row);
    }

    const popFromUsers = (row) => {
        const index = data.users.map(e => e.id).indexOf(row.id);
        data.users.splice(index, 1);
    }

    const handleNameChange = (e) => {
        data.name = e.target.value;
    }

    const handleDescriptionChange = (e) => {
        data.description = e.target.value;
    }

    const handleAddProjectButton = () => {
        data.date_created = new Date();
        axios.post('http://localhost:8000/api/create-project', data)
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
                Create Project
                <div className="userBannerDescription">
                    Add a new Project
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                    <div className="userDisplay">
                        <h3 className="userDisplayTitle">
                            Project Information
                        </h3>
                        <form action="" className="userUpdateForm">
                            <div className="userUpdateItem">
                                <label>Project Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Project Name"
                                    onChange={handleNameChange}
                                    >
                                </input>
                            </div>
                            <div className="userUpdateItem">
                                <label>Description</label>
                                <textarea 
                                    type="text" 
                                    rows = "5" cols = "10"
                                    placeholder="Description"
                                    onChange={handleDescriptionChange}
                                    >
                                </textarea>
                            </div>
                        </form>
                        <div className="userUpdateRightSide">
                            <button className="userAddButton" onClick={ () => 
                                handleAddProjectButton()
                            }>
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div>
                    {<CreateProjectUserList data={data} pushToUsers={pushToUsers} popFromUsers={popFromUsers} />}
                </div> */}
            </div>
        </div>
    )
}
