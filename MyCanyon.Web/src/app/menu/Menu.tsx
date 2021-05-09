import { Link } from "react-router-dom";

import "./Menu.css";

const Menu = () => {
    return (
        <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/trips">Canyon trips</Link>
            <Link to="/account">Account</Link>
        </div>
    );
}

export default Menu;