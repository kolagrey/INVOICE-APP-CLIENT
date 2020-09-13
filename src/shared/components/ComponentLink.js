import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * React Router Nav Link wrapper to forward the ref to fix "Function components cannot be given refs. 
 * Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
 *
 * From https://material-ui.com/guides/composition/#caveat-with-refs
 */
class ComponentLink extends Component {
    render() {
        const { forwardedRef, ...props } = this.props
        return <NavLink {...props} ref={forwardedRef} />
    }
}

export default ComponentLink;