const Notification = ({message}) => {
    if (message === null)
        return
    else {
        const tag = {
            success: {
                background: 'lightgrey',
                color: 'green',
                border: '3px solid green',
                borderRadius: '5px',
                font: '20px',
                margin: '10px',
                padding: '10px',
            },
            error: {
                background: 'lightgrey',
                color: 'red',
                border: '3px solid red',
                borderRadius: '5px',
                font: '20px',
                margin: '10px',
                padding: '10px',
            },
        }
        return (
            <div style={tag[message.tag]}>
                { message.content }
            </div>
        )
    }
}

export default Notification