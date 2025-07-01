const Notification = (props) => {
    if (props.message === null) {
        return null
    }

    return (
        <div className={props.notifType}>
            {props.message}
        </div>
    )
}

export default Notification