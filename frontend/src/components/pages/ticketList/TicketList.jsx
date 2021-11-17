import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

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


export default function TicketList() {
    
    const [rows, setRows] = useState([
        {   
            id: 1, 
            ticket_title: '', 
            assigned_to: '', 
            project_name: '', 
            status:'',
            date_created: '', 
            description: '', 
            submitter: '', 
            priority:'',
            ticket_type:'',
            ticket_comments: [],
            ticket_events: [],
            ticket_attachments: [],
        }
    ]);
    const [dataLoaded, setDataLoaded] = useState("");
    const [data, setData] = useState(rows)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-tickets')
        .then((res) => {
            setData(res.data);
            setRows(res.data);
            setDataLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

    function Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function MakeDate(str) {
        return new Date(str);
    }

    const handleDeleteButton = (id) => {
        axios.delete('http://localhost:8000/api/delete-ticket/'+id)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err);
        });
        setDataLoaded(false);
    }

    const columns = [
        { field: 'ticket_title', headerName: 'Ticket', flex: 1, renderCell: (params) => {
            const str = Capitalize(params.row.ticket_title);
            return (
                <div>
                    {str}
                </div>
            )
        } },
        { field: 'assigned_to', headerName: 'Assigned To', flex: 1, renderCell: (params) => {
            if(params.row.assigned_to) {
                const f_str = Capitalize(params.row.assigned_to.first_name);
                const l_str = Capitalize(params.row.assigned_to.last_name);
                const str = f_str + ' ' + l_str;
                return (
                    <div>
                        {str}
                    </div>
                )
            }
        } },
        { field: 'project_name', headerName: 'Project', flex: 1, renderCell: (params) => {
            if(params.row.project_name) {
                const str = Capitalize(params.row.project_name.name);
                return (
                    <div>
                        {str}
                    </div>
                )
            }

        }  },
        { field: 'status', headerName: 'Status', flex: 0.8, renderCell: (params) => {
            const str = Capitalize(params.row.status);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        { field: 'date_created', headerName: 'Date Created', flex: 1, renderCell: (params) => {
            if(params.row.date_created !== '') {
                const str = MakeDate(params.row.date_created).toLocaleString();
                return (
                    <div>
                        {str}
                    </div>
                )
            }
        }  },
        { field: 'description', headerName: 'Description', flex: 1, renderCell: (params) => {
            const str = Capitalize(params.row.description);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        { field: 'submitter', headerName: 'Submitter', flex: 1, renderCell: (params) => {
            if(params.row.submitter){
                const f_str = Capitalize(params.row.submitter.first_name);
                const l_str = Capitalize(params.row.submitter.last_name);
                const str = f_str + ' ' + l_str;
                return (
                    <div>
                        {str}
                    </div>
                )
            }
        }  },
        { field: 'priority', headerName: 'Priority', flex: 0.8, renderCell: (params) => {
            const str = Capitalize(params.row.priority);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        { field: 'ticket_type', headerName: 'Type', flex: 0.65, renderCell: (params) => {
            const str = Capitalize(params.row.ticket_type);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        {
            field: "action",
            headerName: "Action",
            flex: 0.7,
            renderCell: (params) => {
                return(
                    <div className="actionCell">
                        <Link to={{
                                pathname: "/ticket/"+params.row.id,
                                state: {
                                    id: params.row.id,
                                }}}
                            >
                            <div className="userListEdit">
                                <EditIcon/>
                            </div>
                        </Link>
                        <div className="userListDelete">
                            <DeleteOutlineIcon onClick={ () =>
                                handleDeleteButton(params.row.id)
                            }/>
                        </div>
                    </div>
                )
            }
        },
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
        <div className="userListContainer">
            <span className="userListBanner">
                Ticket List
                <div className="userListDescription">
                    All Open and Closed Tickets
                    <Link to='/create-ticket'>
                        <button className="userAddButton">Create Ticket</button>
                    </Link>
                </div>
            </span>
            <DataGrid className="userList"
                components={{ Toolbar: QuickSearchToolbar }}
                rows={rows}
                columns={columns}
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
