import { withRouter } from "react-router";
import {useEffect} from 'react';

const SctollToTop = ({children, location: {pathname}} : any) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
}

export default withRouter(SctollToTop);