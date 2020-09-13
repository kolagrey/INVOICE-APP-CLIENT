import React from 'react';
import moment from 'moment';
import { List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '../../materials';
import { Logo192 } from '../../assets';

const NotificationsCard = (props) => {
    const { classes, notifications } = props;
    return (
        <List className={classes.listRoot}>
            {
                notifications.map(item => {
                    return (
                    <div key={item._id} className="animated slideInLeft">
                        <ListItem alignItems="flex-start" className={classes.notificationListItem}>
                            <ListItemAvatar>
                                <Avatar alt={item.avatar} src={item.avatar ? item.avatar : Logo192} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.message}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {moment(item.createdAt).fromNow()}
                                        </Typography>
                                        &nbsp; - {moment(item.createdAt).format('LLL')}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </div>
                    )
                })
            }
        </List>
    )
}

export default NotificationsCard;