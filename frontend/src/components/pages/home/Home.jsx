import MyProjects from "../../myProjects/MyProjects";
import MyProjectsTable from "../../myProjects/MyProjectsTable";
import "./home.css";

export default function Home() {
    return (
        <div className="userListContainer">
            <span className="userListBanner">
                Home Dashboard
                <div className="userListDescription">
                    Your Projects and Tickets
                </div>
            </span>
        </div>
    )
}
