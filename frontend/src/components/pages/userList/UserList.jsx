import React, { useState, useEffect } from "react";
import "./userList.css";
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

export default function UserList() {

    const [rows, setRows] = useState([
        { id: 1, first_name: '', last_name: '', email: '', role:'' }
    ]);
    const [dataLoaded, setDataLoaded] = useState("");
    const [data, setData] = useState(rows)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-users')
        .then((res) => {
            setData(res.data)
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

    const handleDeleteButton = (id) => {
        axios.delete('http://localhost:8000/api/delete-user/'+id)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err);
        });
        setDataLoaded(false);
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
            headerName: "Action",
            flex: 1,
            renderCell: (params) => {
                return(
                    <div className="actionCell">
                        <Link to={{
                                pathname: "/user/"+params.row.id,
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
                Users List
                <div className="userListDescription">
                    All Personnel
                    <Link to='/create-user'>
                        <button className="userAddButton">Create User</button>
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
    );
}
