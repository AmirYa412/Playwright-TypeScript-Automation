import axios, {AxiosInstance, AxiosResponse} from 'axios';

class Client {
    protected readonly session: AxiosInstance;
    protected readonly testedEnvBaseUrl: string;

    constructor() {
        // Load API_BASE_URL from loaded .env file in config file
        this.testedEnvBaseUrl = `${process.env.PROTOCOL}${process.env.API_BASE_URL}`;
        this.session = axios.create({
            baseURL: this.testedEnvBaseUrl,
            headers: this.getHeaders(),
            // Disable validation of status code
            validateStatus:  (): boolean => {
                return true;
            }
        });
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'User-Agent': 'Node.js/21.7.1 axios/1.6.8',
            'Accept': 'application/json',
        }
    }

    async getRequest(path: string, params?: any): Promise<AxiosResponse> {
        return await this.session.get(path, {params});
    }

    async postRequest(path: string, data?: any): Promise<AxiosResponse> {
        return await this.session.post(path, data);
    }
}

export default Client;
