import "./ticket.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import CustomModal from "../../muiComponents/CustomModal";
import { useState, useEffect } from "react";
import axios from "axios";
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import BugReportIcon from '@mui/icons-material/BugReport';
import AppsIcon from '@mui/icons-material/Apps';
import TicketCommentList from "../ticketList/TicketCommentList";
import TicketAttachmentList from "../ticketList/TicketAttachmentList";

export default function Ticket() {
   
    const location = useLocation()

    const ticket = {
        id: location.state.id,
        ticket_title: '',
        assigned_to: '',
        project_name: '',
        status: '',
        date_created: '',
        description: '',
        submitter: '',
        priority: '',
        ticket_type: '',
        ticket_comments: [],
        ticket_events: [],
        ticket_attachments: [],
    }

    const [dataLoaded, setDataLoaded] = useState("");
    const [ticketData, setTicketData] = useState(ticket)
    const [rows, setRows] = useState([
        { id: 1, first_name: '', last_name: '', email: '', role:'' }
    ]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-ticket/'+ticket.id)
        .then((res) => {
            setTicketData(res.data)
        })
        .catch((err) => {
            console.log(err);
        });
        axios.get('http://localhost:8000/api/get-users')
        .then((res) => {
            setRows(res.data);
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
    const setTitleSuccess = () => setTitle("Ticket Updated");
    const setTitleFailed = () => setTitle("Failed to Update Ticket");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Ticket Information Update Successful");
    const setDescFailed = () => setDesc("Be sure all information is correctly entered...");

    const handleTicketStatusChange = (e) => {
        ticketData.status = e.target.value;
    }

    const handleTicketPriorityChange = (e) => {
        ticketData.priority = e.target.value;
    }

    const date = new Date(ticketData.date_created)

    const handleUpdateTicketButton = () => {
        axios.put('http://localhost:8000/api/update-ticket/'+ticket.id, ticketData)
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

    const commentData = {
        submitter: '',
        message: '',
        date_created: '',
        ticket_name: ticket.id,
    }

    const handleAddCommentButton = () => {
        commentData.date_created = new Date();
        axios.post('http://localhost:8000/api/create-comment', commentData)
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

    const updatedTicketData = () => {
        setDataLoaded(false)
    }

    const commentsExist = () => {
        return ticketData.ticket_comments.length > 0;
    }

    const attachmentsExist = () => {
        return ticketData.ticket_attachments.length > 0;
    }

    const handleCommentSubmitterChange = (e) => {
        commentData.submitter = e.target.value;
    }

    const handleMessageChange = (e) => {
        commentData.message = e.target.value;
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
                Edit Ticket
                <div className="userBannerDescription">
                    Edit selected ticket or create new
                    <Link to='/create-ticket'>
                        <button className="userAddButton">Create Ticket</button>
                    </Link>
                </div>
            </span>
            <div className="user">
                <div className="userContainer">
                    <div className="ticketDisplay">
                        <h3 className="userDisplayTitle">
                            Ticket Information
                        </h3>
                        <ul className="userInformationList">
                            <li className="userInformationListItem">
                                <BugReportIcon className="userInformationIcon"/>
                                {ticketData.ticket_title}
                            </li>
                            <li className="userInformationListItem">
                                <DescriptionIcon className="userInformationIcon"/>
                                {ticketData.description}
                            </li>
                            <li className="userInformationListItem">
                                <FolderIcon className="userInformationIcon"/>
                                {ticketData.status}
                            </li>
                            <li className="userInformationListItem">
                                <LowPriorityIcon className="userInformationIcon"/>
                                {ticketData.priority}
                            </li>
                            <li className="userInformationListItem">
                                <AppsIcon className="userInformationIcon"/>
                                {ticketData.ticket_type}
                            </li>
                            <li className="userInformationListItem">
                                <EventIcon className="userInformationIcon"/>
                                Created - {date.toLocaleString()}
                            </li>
                            <li className="userInformationListItem">
                                <PersonIcon className="userInformationIcon"/>
                                Submitter - {ticketData.submitter.first_name} {ticketData.submitter.last_name}
                            </li>
                            <li className="userInformationListItem">
                                <PersonIcon className="userInformationIcon"/>
                                Assigned to - {ticketData.assigned_to.first_name} {ticketData.assigned_to.last_name}
                            </li>
                            <li className="userInformationListItem">
                                <WorkIcon className="userInformationIcon"/>
                                Project - {ticketData.project_name.name}
                            </li>
                        </ul>
                        <span className="userUpdateTitle">Edit</span>
                            <form action="" className="userUpdateForm">
                                <div className="userUpdateItem">
                                    <label>Status</label>
                                    <select selected
                                        type="text"
                                        placeholder={ticketData.status}
                                        onChange={handleTicketStatusChange}
                                        >
                                        <option value="">Select a Status</option>
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                                <div className="userUpdateItem">
                                    <label>Priority</label>
                                    <select selected
                                        type="text"
                                        placeholder={ticketData.priority}
                                        onChange={handleTicketPriorityChange}
                                        >
                                        <option value="">Select a Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </form>
                            <div className="userUpdateRightSide">
                                <button className="userAddButton" onClick={ () => {
                                    handleUpdateTicketButton()
                                }}>
                                    Update Ticket
                                </button>
                            </div>
                    </div>
                    <div className="rightSideSplit">
                        <div className="commentList">
                            <h3 className="userDisplayTitle">
                                Comments
                            </h3>
                            <div className="userUpdateItem">
                                <label>Submit New Comment</label>
                                <select
                                    type="text"
                                    onChange={handleCommentSubmitterChange}
                                    >
                                    <option value="NULL">Select a Developer</option>
                                    {rows.map(user => {
                                        return(
                                            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <form action="" className="userUpdateForm">
                                <div className="userUpdateItem">
                                    <textarea 
                                        type="text" 
                                        rows = "3" cols = "10"
                                        placeholder="Message..."
                                        onChange={handleMessageChange}
                                        >
                                    </textarea>
                                </div>
                            </form>
                            <button className="userAddButton" onClick={ () => {
                                handleAddCommentButton()
                            }}>
                                Add Comment
                            </button>
                            {(dataLoaded && commentsExist()) ? <TicketCommentList ticketData={ticketData} updatedTicket={updatedTicketData} /> : null}
                        </div>
                    </div>
                </div>
                {/* <div className="attachmentList">
                    <h3 className="userDisplayTitle">
                        Attachments
                    </h3>
                    {(dataLoaded && attachmentsExist()) ? <TicketAttachmentList ticketData={ticketData} updatedUsers={updatedTicketData} /> : null}
                </div> */}
            </div>
        </div>
    )
}
