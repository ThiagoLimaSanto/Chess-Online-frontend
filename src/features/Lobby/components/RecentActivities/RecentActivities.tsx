import type { Activity } from "../../hooks/useLobbyData"
import styles from "./RecentActivities.module.css"

type RecentActivitiesProps = { activities: Activity[] }
export function RecentActivities({ activities }: RecentActivitiesProps) {
    return <section className={styles.card}><div className={styles.heading}><h2>⚡ Atividade recente</h2><button>Ver todas</button></div>{activities.map((activity) => <div className={styles.activity} key={activity.label}><span>{activity.icon}</span><span>{activity.label}<small>{activity.time}</small></span></div>)}</section>
}
