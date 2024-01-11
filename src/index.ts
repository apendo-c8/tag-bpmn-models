import {getInput, setFailed} from "@actions/core";
import axios from "axios";

const TAG = getInput('tag');
const SOURCE = getInput('project_id');
const MODELER_CLIENT_ID = getInput('client_id')
const MODELER_CLIENT_SECRET = getInput('client_secret')

const getToken = async () => {

    try {
        const url = 'https://login.cloud.camunda.io/oauth/token';
        const data = {
            grant_type: 'client_credentials',
            audience: 'api.cloud.camunda.io',
            client_id: MODELER_CLIENT_ID,
            client_secret: MODELER_CLIENT_SECRET
        };

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const token = response.data.access_token

            // Remove all whitespaces from token
            return token.replace(/\s+/g, '');

        } else {
            console.error('Error:', response.statusText);
            return null;
        }
    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
        return null;
    }
}


const getFileIdsByProjectId = async (token: string) => {

    try {
        const urlMilestone = 'https://modeler.cloud.camunda.io/api/v1/files/search';

        // TODO: page can not be larger than 50?
        const body = {
            "filter": {
                "projectId": SOURCE
            }, "page": 0, "size": 50
        };

        const response = await axios.post(urlMilestone, body, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
            }
        });

        return response.data.items.map((item: any) => item.id);

    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
    }
}


const setMilestone = async (token: string, fileId: string) => {

    try {
        const urlMilestone = 'https://modeler.cloud.camunda.io/api/v1/milestones';

        const body = {
            "name": TAG, "fileId": fileId
        }

        const response = await axios.post(urlMilestone, body, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data);
    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
    }

}

const runWorkflow = async () => {

    try {
        const token = await getToken();
        const fileIds = await getFileIdsByProjectId(token);

        for (const file of fileIds) {

            await setMilestone(token, file);
        }

    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
    }

}

runWorkflow()
    .then(() => {
        console.log("Workflow completed successfully.");
    })
    .catch((error) => {
        console.error("Workflow failed:", error);
    });
