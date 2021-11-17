import React, { useState, useEffect } from "react";
import "./smallUserList.css";
import "./userList.css";
import axios from "axios";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CustomModal from "../../muiComponents/CustomModal";

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

export default function CreateProjectUserList(props) {

    const projectData = props.data;

    const [show, setShow] = useState(false);
    const modalOpen = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }

    const [title, setTitle] = useState("");
    const setTitleSuccess = () => setTitle("Developer Added");
    const setTitleFailed = () => setTitle("Failed to add developer to the project");

    const [desc, setDesc] = useState("");
    const setDescSuccess = () => setDesc("Successfully updated project's developers");
    const setDescFailed = () => setDesc("Server issue...");

    const [rows, setRows] = useState([
        { id: 1, first_name: '', last_name: '', email: '', role:'' }
    ]);
    const [dataLoaded, setDataLoaded] = useState("");
    const [data, setData] = useState(rows)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-users')
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

    function userAssigned(id) {
        const ar = [];
        if(projectData.users) {
            projectData.users.forEach(element => {
                ar.push(element.id);
            })
            if(ar.includes(id)){
                return true;
            }
            return false;
        }
    }

    const userDeleteIcon = (row) => {
        return(
            <div className="actionCell">
                <HighlightOffIcon
                    className="deleteUserIcon"
                    onClick={ () =>
                        handleDeleteButton(row)
                }/>
            </div>
        )
    }

    function handleDeleteButton(row) {
        props.popFromUsers(row);
        setDataLoaded(false);
    }

    function handleAddButton(row) {
        props.pushToUsers(row);
        setDataLoaded(false);
    }

    const userAddIcon = (row) => {
        return(
            <div className="actionCell">
                <AddCircleOutlineIcon
                    className="addUserIcon"
                    onClick={ () =>
                        handleAddButton(row)
                }/>
            </div>
        )
    }

    const columns = [
        { field: 'first_name', headerName: 'First', flex: 1, renderCell: (params) => {
            const str = Capitalize(params.row.first_name);
            return (
                <div>
                    {str}
                </div>
            )
        } },
        { field: 'last_name', headerName: 'Last', flex: 1, renderCell: (params) => {
            const str = Capitalize(params.row.last_name);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        { field: 'email', headerName: 'Email', flex: 1.5, },
        { field: 'role', headerName: 'Role', flex: 1, renderCell: (params) => {
            const str = Capitalize(params.row.role);
            return (
                <div>
                    {str}
                </div>
            )
        }  },
        {
            field: "action",
            headerName: "Add to Project",
            flex: 1,
            renderCell: (params) => {
                return(
                    <div>
                        {userAssigned(params.row.id) ? userDeleteIcon(params.row) : userAddIcon(params.row)}
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
