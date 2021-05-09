import OnedriveLogin from "Onedrive/OnedriveLogin";
import OnedriveBrowser from "Onedrive/OnedriveBrowser";
import { loadData } from "./AppData";

const Account = () => {

    const downloadData = () => {
        const text = JSON.stringify(loadData(), undefined, 4);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'my-canyon.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

    return (
        <div>
            <span className="title">Account</span>
            <button onClick={downloadData}>Download data</button><br />
            <OnedriveLogin showWhenAuthenticated />
            <OnedriveBrowser />
        </div>
    );
}

export default Account;