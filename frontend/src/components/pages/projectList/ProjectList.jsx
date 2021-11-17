import React, { useState, useEffect } from "react";
import "./projectList.css";
import axios from "axios";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function handleDeleteButton(id, setDataLoaded) {
    axios.delete('http://localhost:8000/api/delete-project/'+id)
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err);
    });
    setDataLoaded(false);
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const gunnarStyle = { padding: "0px" }

    const date = new Date(row.date_created)

    return (
        <React.Fragment>
            <TableRow style={gunnarStyle}>
                <TableCell style={gunnarStyle}>
                    <IconButton
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell style={gunnarStyle}>{row.name}</TableCell>
                <TableCell style={gunnarStyle}>{date.toLocaleString()}</TableCell>
                <TableCell style={gunnarStyle}>{row.description}</TableCell>
                <TableCell style={gunnarStyle}>
                    <div className="actionCell">
                        <Link to={{
                                pathname: "/project/"+row.id,
                                state: {
                                    id: row.id,
                                    name: row.name,
                                    date_created: row.date_created,
                                    description: row.description,
                                    users:row.users,
                                    tickets:row.tickets,
                                }}}
                            >
                            <div className="projectListEdit">
                                <EditIcon/>
                            </div>
                        </Link>
                        <div className="projectListDelete">
                            <DeleteOutlineIcon onClick={ () => handleDeleteButton(row.id, props.setDataLoaded)}/>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                    <Typography gutterBottom component="div">
                        Assigned Developers
                    </Typography>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {row.users.map((userRow) => (
                            <TableRow key={userRow.email}>
                            <TableCell>{userRow.first_name}</TableCell>
                            <TableCell>{userRow.last_name}</TableCell>
                            <TableCell>{userRow.email}</TableCell>
                            <TableCell>{userRow.role}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </Box>
                </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string,
        date_created: PropTypes.string,
        description: PropTypes.string,
        users: PropTypes.arrayOf(
            PropTypes.shape({
                first_name: PropTypes.string,
                last_name: PropTypes.string,
                email: PropTypes.string,
                role: PropTypes.string,
            }),
        ),
    }),
};

export default function ProjectList() {

    const [rows, setRows] = useState([{ 
        id: 1, 
        name: '', 
        date_created: '', 
        description: '', 
        users:[],
    }]);

    const [dataLoaded, setDataLoaded] = useState("");
    const [data, setData] = useState(rows)

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-projects')
        .then((res) => {
            setData(res.data)
            setRows(res.data);
            setDataLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [dataLoaded]);

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
        <div className="projectListContainer">
            <span className="projectListBanner">
                Project List
                <div className="projectListDescription">
                    All Open Projects
                    <Link to='/create-project'>
                        <button className="projectAddButton">Create Project</button>
                    </Link>
                </div>
            </span>
            <TableContainer class="projectList">
                <div className="searchBar">
                    <div className="searchInput">
                        <TextField
                            value={searchText}
                            onChange={(event) => requestSearch(event.target.value)}
                            placeholder="Search…"
                            InputProps={{
                                startAdornment: <SearchIcon className="toolbarIcon"/>
                            }}
                        />
                    </div>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} setDataLoaded={setDataLoaded}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
