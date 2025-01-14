import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRotateForward,
    faAutomobile, faBell,
    faCalendar, faCalendarCheck, faCheckCircle,
    faGraduationCap,
    faHome,
    faListSquares,
    faRobot,
    faTv, faWarning
} from "@fortawesome/free-solid-svg-icons";
import {dateToElapsed} from "../tools/DateString";
import {useEffect, useState} from "react";
import {getSyncStatus} from "../api/global.api";

function NavElement(props: { text: string, icon: any, link: string }) {
    const navigate = useNavigate();

    return (
        <div
            className={"flex items-center justify-center text-white cursor-pointer bg-blue-950 px-5 min-w-36 h-8 rounded hover:bg-blue-900"}
            onClick={() => navigate(props.link)}>
            <div className={"flex flex-row items-center justify-center"}>
                <div>
                    <FontAwesomeIcon icon={props.icon}/>
                </div>
                <p className={"ml-2"}>{props.text}</p>
            </div>

        </div>
    );
}


function SyncStatus() {

    const [last_sync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        const reload = async () => {
            const status = await getSyncStatus();
            let date = (() => {
                if (status.mouli !== null) return status.mouli;
                if (status.planning !== null) return status.planning;
                if (status.projects !== null) return status.projects;
                return null;
            })();
            setLastSync(date);
        }
        const interval = setInterval(async () => {
            reload();
        }, 30000);
        reload();
        return () => clearInterval(interval);
    }, []);


    const gen_visual = (color: string, icon: any, text: string) => (
        <div className={"flex px-1.5 flex-row items-center rounded-full bg-blue-300 bg-opacity-20"}>
            <FontAwesomeIcon icon={icon} className={color} fontSize={"13px"}/>
            <p className={"text-white text-xs my-1 ml-1 text-nowrap"}>Sync: {text}</p>
        </div>
    );



    const total_minutes = (date: Date) => {
        const diff = new Date().getTime() - date.getTime();
        return Math.floor(diff / 60000);
    }

    if (last_sync === null)
        return gen_visual("text-red-500", faWarning, "Never Synced");

    if (total_minutes(last_sync) > 60)
        return gen_visual("text-red-500", faWarning, dateToElapsed(last_sync));
    else
        return gen_visual("text-green-500", faCheckCircle, dateToElapsed(last_sync));
}

export default function TopBar(): React.ReactElement {
    return (
        <div className={"bg-gray-700"}>
            <div className={"flex h-14 items-center justify-between"}>
                <div className={"flex flex-row items-center gap-4 ml-4 w-1/3"}>
                    <div className={"h-full flex flex-row items-center"}>
                        <img
                            src={require("../assets/epitech.png")}
                            alt={"Epitech"}
                            className={"w-12"}
                        />
                        <p className={"text-white ml-1 font-bold"}>TekBetter</p>
                    </div>
                    <SyncStatus />
                </div>

                <div className={"flex gap-4 justify-center w-1/3"}>
                    <NavElement text={"Moulinettes"} link={"/moulinettes"} icon={faGraduationCap}/>
                    <NavElement text={"Calendar"} link={"/calendar"} icon={faCalendarCheck}/>
                    <NavElement text={"Synchronisation"} link={"/sync"} icon={faCheckCircle}/>
                </div>
                <div className={"w-1/3"}></div>
            </div>
        </div>
    );
}