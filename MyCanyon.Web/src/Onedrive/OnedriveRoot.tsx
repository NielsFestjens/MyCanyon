import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: "88a6805e-d6a2-4f35-a007-96d91d2550b4",
        authority: "https://login.microsoftonline.com/consumers",
        redirectUri: "http://localhost:3000/"
    },
    cache: { cacheLocation: "sessionStorage" },
    system: { loggerOptions: { loggerCallback: (_: any, message: string) => console.info(message) } }
};

const msalInstance = new PublicClientApplication(msalConfig);

interface OnedriveRootProps {
    children: React.ReactNode;
}
const OnedriveRoot : React.FC<OnedriveRootProps> = ({ children }) =>  {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    )
}
export default OnedriveRoot;