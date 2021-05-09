const Home: React.FC = () => {
    return (
        <div>
            <span className="title">Home</span>
            Hi there, and welcome to your very own canyoning history!<br />
            This website is still in development, and this is my todo-list:
            <ul>
                <li style={{textDecoration: "line-through"}}>Create a home page (this one!)</li>
                <li style={{textDecoration: "line-through"}}>Allow user to create/update/delete trips</li>
                <li style={{textDecoration: "line-through"}}>Integrate OneDrive</li>
                <li style={{textDecoration: "line-through"}}>Integrate Google Maps and let the user select a location for their trip</li>
                <li style={{textDecoration: "line-through"}}>Add some basic styling and a navigation menu</li>
                <li style={{textDecoration: "line-through"}}>Allow user to create/update/delete canyons in trips</li>
                <li style={{textDecoration: "line-through"}}>Allow user to select a Onedrive folder for pictures in a trip / canyon</li>
                <li style={{textDecoration: "line-through"}}>Allow user to select the actual canyon in a trip canyon</li>
                <li>Use actual ids</li>
                <li>Add better styling</li>
                <li>Integrate server sync</li>
            </ul>
        </div>
    );
}

export default Home;