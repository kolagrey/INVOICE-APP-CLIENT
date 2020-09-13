import React from 'react';
import { connect } from 'react-redux';
import TableCard from '../../shared/components/TableCard';
import { Button, CircularProgress, Grid } from '../../materials';

class UsersPage extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes, users, loading } = this.props;
        return (
            <Grid container>
                <h1>Platform Users</h1>
                { loading && <CircularProgress/>}
                <TableCard classes={classes} data={users}/>
                <Button className={classes.button}>Load More</Button>
            </Grid>
        )
    }
};

const mapStateToProps = state => {
    return {
        users: state.users.hunters,
        loading: state.users.loading
    }
}

export default connect(mapStateToProps)(UsersPage);