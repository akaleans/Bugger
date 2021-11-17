import axios from "axios";
import CustomModal from "../../muiComponents/CustomModal";
import { useState, useEffect } from "react";

export default function CreateTicket() {

    const [projects, setProjects] = useState([{ 
        id: 1, 
        name: '', 
        date_created: '', 
        description: '', 
        users:[],
        tickets: [],
    }]);
    const [rows, setRows] = useState([
        { id: 1, first_name: '', last_name: '', email: '', role:'' }
    ]);
    const [dataLoaded, setDataLoaded] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-users')
        .then((res) => {
            setRows(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
        axios.get('http://localhost:8000/api/get-projects')
        .then((res) => {
            setProjects(res.data);
            setDataLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Ticket Added");
    const setTitleFailed = () => setTitle("Failed to Add Ticket");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Ticket Added Successfully to Database");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered...");

    const data = {
        ticket_title: '',
        assigned_to: '',
        project_name: '',
        status: 'Open',
        date_created: '',
        description: '',
        submitter: '',
        priority: '',
        ticket_type: '',
        ticket_comments: [],
        ticket_events: [],
        ticket_attachments: [],
    }

    const handleTicketTitleChange = (e) => {
        data.ticket_title = e.target.value;
    }

    const handleAssignedToChange = (e) => {
        data.assigned_to = e.target.value;
    }

    const handleProjectNameChange = (e) => {
        data.project_name = e.target.value;
    }

    const handleDescriptionChange = (e) => {
        data.description = e.target.value;
    }

    const handleSubmitterChange = (e) => {
        data.submitter = e.target.value;
    }

    const handlePriorityChange = (e) => {
        data.priority = e.target.value;
    }

    const handleTicketTypeChange = (e) => {
        data.ticket_type = e.target.value;
    }

    const handleAddTicketButton = () => {
        data.date_created = new Date();
        axios.post('http://localhost:8000/api/create-ticket', data)
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
                Create Ticket
                <div className="userBannerDescription">
                    Add new ticket to the database
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                    <div className="userDisplay">
                        <h3 className="userDisplayTitle">
                            Ticket Informaiton
                        </h3>
                        <form action="" className="userUpdateForm">
                            <div className="userUpdateItem">
                                <label>Ticket Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Ticket Title"
                                    onChange={handleTicketTitleChange}
                                    >
                                </input>
                            </div>
                            <div className="userUpdateItem">
                                <label>Assign Developer</label>
                                <select
                                    type="text"
                                    onChange={handleAssignedToChange}
                                    >
                                    <option value="NULL">Select a Developer</option>
                                    {rows.map(user => {
                                        return(
                                            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="userUpdateItem">
                                <label>Assign Project</label>
                                <select
                                    type="text"
                                    onChange={handleProjectNameChange}
                                    >
                                    <option value="NULL">Select a Project</option>
                                    {projects.map(project => {
                                        return(
                                            <option key={project.id} value={project.id}>{project.name}</option>
                                        )
                                    })}
                                </select>
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
                            <div className="userUpdateItem">
                                <label>Submitter</label>
                                <select
                                    type="text"
                                    onChange={handleSubmitterChange}
                                    >
                                    <option value="NULL">Select a Submitter</option>
                                    {rows.map(user => {
                                        return(
                                            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="userUpdateItem">
                                <label>Priority</label>
                                <select
                                    type="text"
                                    onChange={handlePriorityChange}
                                    >
                                    <option value="NULL">Select a Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="userUpdateItem">
                                <label>Type</label>
                                <select
                                    type="text"
                                    onChange={handleTicketTypeChange}
                                    >
                                    <option value="NULL">Select a Ticket Type</option>
                                    <option value="Bug">Bug</option>
                                    <option value="Feature">Feature</option>
                                    <option value="API Change">API Change</option>
                                </select>
                            </div>
                        </form>
                        <div className="userUpdateRightSide">
                            <button className="userAddButton" onClick={ () => 
                                handleAddTicketButton()
                            }>
                                Add Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
