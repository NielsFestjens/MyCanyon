import { useMsal, useIsAuthenticated } from "@azure/msal-react";

interface OnedriveLoginProps {
    showWhenAuthenticated?: boolean;
}
const OnedriveLogin : React.FC<OnedriveLoginProps> = ({ showWhenAuthenticated }) =>  {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    
    const logInToOneDrive = () => {
        if (isAuthenticated) {
            instance.logoutPopup({ postLogoutRedirectUri: "/" });
        } else {
            instance.loginPopup({ scopes: ["User.Read", "Files.Read"] }).catch(e => { console.log(e); });
        }
    }

    if (isAuthenticated && !showWhenAuthenticated)
        return (<></>);

    return (
        <button onClick={logInToOneDrive}>Onedrive: {isAuthenticated ? 'ingelogd' : 'niet ingelogd'}</button>
    );
}

export default OnedriveLogin;