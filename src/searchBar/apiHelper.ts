class ApiHelper
{
    constructor() { }

    public async getParty(input: string, rvToken: string, baseUrl: string): Promise<object | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };
        const response = await fetch(`${baseUrl}api/Party?PartyId=${input}`, options);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            // Utils.log('GetParty results = ', results);
            return results.Items.$values[0];
        }
    }

    public async getEvent(input: string, rvToken: string, baseUrl: string): Promise<object | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };
        const response = await fetch(`${baseUrl}api/Event?EventId=${input}`, options);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            // Utils.log('GetEvent results = ', results);
            return results.Items.$values[0];
        }
    }

    public async getEventCategory(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };
        const response = await fetch(`${baseUrl}api/EventCategory?EventCategoryId=${input}`, options);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            // Utils.log('GetEventCategory results = ', results);
            return results.Items.$values[0].Description;
        }
    }

    public async getUserName(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };
        const response = await fetch(`${baseUrl}api/User?UserId=${input}`, options);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            // Utils.log('GetUserName results = ', results);
            return results.Items.$values[0].UserName;
        }
    }

    public async findUserIdByName(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };
        const response = await fetch(`${baseUrl}api/User?UserName=${input}`, options);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            // Utils.log('FindUserIdByName results = ', results);
            return results.Items.$values[0].UserId;
        }
    }

    public async getLatestConfigJson(): Promise<ConfigItem[] | null>
    {
        Utils.log('GetLatestConfigJson');
        var response = await fetch('https://cdn.cloud.csiinc.com/iep/config.json', { cache: 'no-cache', method: 'GET' });
        // console.log('response = ', response);
        if (response.ok)
        {
            var results = await response.json();
            // console.log('results = ', results);
            if (results.length > 0)
            {
                // console.log('GetLatestConfigJson results = ', results);
                return results as ConfigItem[];
            }
            // Utils.log('GetUserName results = ', results);
            return results.Items.$values[0].UserName;
        }

        return null;
    }
}