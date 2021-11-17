import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CustomModal from "../../muiComponents/CustomModal";
import ExpandIcon from '@mui/icons-material/Expand';
import { Link } from "react-router-dom";

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
    return (
        <div className="toolbarContainer">
            <div className="leftToolbarButtons">
                <GridToolbarFilterButton class="toolbarButton"/>
                <GridToolbarDensitySelector class="toolbarButton"/>
            </div>
            <TextField
                value={props.value}
                onChange={props.onChange}
                placeholder="Search…"
                InputProps={{
                startAdornment: <SearchIcon className="toolbarIcon"/>
                }}
            />
        </div>
    );
}

QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default function TicketCommentList(props) {
    const updatedTicket = props.updatedTicket

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => setShow(false);

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Developer Added");
    const setTitleFailed = () => setTitle("Failed to add developer to the project");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Successfully updated project's developers");
    const setDescFailed = () => setDesc("Server issue...");

    const ticketData = props.ticketData

    const [rows, setRows] = useState([
        { id: 1, submitter: '', message: '', date_created: '', ticket_name:'' }
    ]);
    const [dataLoaded, setDataLoaded] = useState("");
    const [data, setData] = useState(rows)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-ticket-comments/'+ticketData.id)
        .then((res) => {
            setDataLoaded(true);
            setData(res.data)
            setRows(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

    function Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const columns = [
        { field: 'submitter', headerName: 'Submitter', flex: 0.8, renderCell: (params) => {
            if(params.row.submitter.first_name && params.row.submitter.last_name) {
                const f = Capitalize(params.row.submitter.first_name);
                const l = Capitalize(params.row.submitter.last_name);
                const str = f + ' ' + l;
                return (
                    <div>
                        {str}
                    </div>
                )
            }
        } },
        { field: 'message', headerName: 'Message', flex: 2, renderCell: (params) => {
            const str = Capitalize(params.row.message);
            return (
                <div className="messageContainer">
                    <Link to={{
                            pathname: "/ticket-comment/"+params.row.id,
                            state: {
                                id: params.row.id,
                            }}}
                        >
                        <div className="messageIcon">
                            <ExpandIcon/>
                        </div>
                    </Link>
                    {str}
                </div>
            )
        }  },
        { field: 'date_created', headerName: 'Date Created', flex: 1, renderCell: (params) => {
            const date = new Date(params.row.date_created).toLocaleString();
            return (
                <div>
                    {date}
                </div>
            )
        }  },
    ];

    const [searchText, setSearchText] = React.useState('');

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = data.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
                });
            });
        setRows(filteredRows);
    };

    return (
        <div className="smallUserListContainer">
            <CustomModal
                open={show} 
                handleClose={() => modalClose()} 
                title={title} 
                description={desc}
            />
            <DataGrid className="smallUserList"
                components={{ Toolbar: QuickSearchToolbar }}
                rows={rows}
                columns={columns}
                autoHeight={true}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (event) => requestSearch(event.target.value),
                        clearSearch: () => requestSearch(''),
                    },
                }}
            />
        </div>
    )
}