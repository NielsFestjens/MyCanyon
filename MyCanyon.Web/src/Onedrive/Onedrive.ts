import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";

export async function callMsGraph<T>(instance: IPublicClientApplication, account: AccountInfo, uri: string) {
    const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read", "Files.Read"],
        account: account
    });

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${tokenResponse.accessToken}`);

    const response = await fetch('https://graph.microsoft.com/v1.0' + uri, { method: "GET", headers: headers });
    return (await response.json()).value as T;
}