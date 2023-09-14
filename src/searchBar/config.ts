class ConfigManager
{
    public static readonly ConfigPath: string = "assets/search-bar-config.json";

    constructor(private searchBar: SearchBar, private apiHelper: ApiHelper, private assetHelper: AssetHelper) { }

    public async CheckForConfigUpdate(): Promise<void>
    {
        console.log('CheckForConfigUpdate');
        var lastUpdatedKey = 'iep__searchbBar__lastUpdated';
        var now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        if (lastUpdatedKey in localStorage)
        {
            console.log('lastUpdatedKey in localStorage');
            var lastUpdatedValue = localStorage.getItem(lastUpdatedKey) as string;
            var lastUpdatedDate = new Date(lastUpdatedValue);
            lastUpdatedDate.setUTCHours(0, 0, 0, 0);
            if (lastUpdatedValue != null && lastUpdatedDate < now)
            {
                console.log('lastUpdatedValue != null && lastUpdatedDate < now');
                await this.apiHelper.GetLatestConfigJson().then(async data =>
                {
                    console.log('CheckForConfigUpdate -> GetLatestConfigJson -> data = ', data);
                    if (data && data.length > 0)
                    {
                        await this.SetConfig(data).then(result =>
                        {
                            console.log('CheckForConfigUpdate -> UpdateConfig -> result = ', result);
                            if (result)
                            {
                                localStorage.setItem(lastUpdatedKey, now.toISOString()?.split('T')[0]);
                            }
                        });
                    }
                });
            }
            else
            {
                console.log('......Continue......');
            }
        }
        // first time running updater, fetch config from server and set lastUpdated to today
        else
        {
            console.log('prime chrome storage');
            await this.GetConfig().then(async data =>
            {
                var result = await this.SetConfig(data);
                if (result)
                {
                    localStorage.setItem(lastUpdatedKey, now.toISOString()?.split('T')[0]);
                }
            });
        }
    }

    public async SetConfig(data: ConfigItem[]): Promise<boolean>
    {
        console.log('UpdateConfig');
        return await chrome.storage.local.set({ 'JsonConfig': data })
            .then(() => true)
            .catch(() => false);
    }

    public async GetConfig(): Promise<ConfigItem[]>
    {
        console.log('GetConfig');
        return await chrome.storage.local.get(['JsonConfig'])
            .then(async (data) =>
            {
                console.log('Chrome Data = ', data);
                if (data && data.JsonConfig && data.JsonConfig.length > 0)
                {
                    console.log('found json data in Chrome storage');
                    return (data.JsonConfig as ConfigItem[]).sort((a, b) => a.displayName.localeCompare(b.displayName));
                }
                else
                {
                    return await this.apiHelper.GetLatestConfigJson().then(async (data: ConfigItem[] | null) =>
                    {
                        console.log('GetConfig -> GetLatestConfigJson -> Server Data = ', data);
                        if (data && data.length > 0)
                        {
                            console.log('NO json data in Chrome storage... getting from SERVER...');
                            return data.sort((a, b) => a.displayName.localeCompare(b.displayName));
                        }
                        else
                        {
                            console.log('NO json data in Chrome storage AND server failed... getting from LOCAL...');
                            // something went wrong -> get from local
                            return await fetch(chrome.runtime.getURL(ConfigManager.ConfigPath))
                                .then(data => data.json() as Promise<ConfigItem[]>)
                                .then(data =>
                                {
                                    return data.sort((a, b) => a.displayName.localeCompare(b.displayName));
                                });
                        }
                    });
                }
            });
    }

    public SetEventListeners(rvToken: string, baseUrl: string, includeTags = false): void
    {
        // Add hover effects
        $('.commandBarListItem')
            .on("mouseenter", e => $(e.currentTarget).addClass('commandBarHover'))
            .on("mouseleave", e => $(e.currentTarget).removeClass('commandBarHover'))
            .on('click', e =>
            {
                var anchorId = $(e.currentTarget).find('a').attr('id');
                if (anchorId == "usernameLookup" || anchorId == "eventCodeLookup")
                {
                    // this is to prevent event conflict with "eventCodeLookup" & "usernameLookup" on click listeners
                } else
                {

                    if ($(e.currentTarget).find('.lookupLoader').length == 0)
                    {
                        $(e.currentTarget).find('a').append(this.searchBar.GetLoader());
                    }
                }
            });

        if (includeTags)
        {
            var input = $('#commandBarInput').val() as string;
            $('#eventCodeLookup').on("click", async () =>
            {
                $('#eventCodeLookup').append(this.searchBar.GetLoader());
                var event = await this.apiHelper.GetEvent(input, rvToken, baseUrl);
                console.log('event = ', event);
                if (event == null)
                {
                    $('#eventCodeLookup .lookupLoader').remove();
                    if ($('#eventCodeLookup').find('.lookupErrorBadge').length == 0)
                    {
                        $('#eventCodeLookup').append(this.searchBar.GetLookupErrorBadge());
                    }
                    return;
                }
                else
                {
                    await this.searchBar.SetEventDetails(event);
                    this.searchBar.ActivateTab(this.searchBar.EventDetailsTab);
                }
            });
            $('#usernameLookup').on("click", async () =>
            {
                $('#usernameLookup').append(this.searchBar.GetLoader());
                var imisId = await this.apiHelper.FindUserIdByName(input, rvToken, baseUrl);
                console.log('imisId = ', imisId);
                if (imisId == null)
                {
                    $('#usernameLookup .lookupLoader').remove();
                    if ($('#usernameLookup').find('.lookupErrorBadge').length == 0)
                    {
                        $('#usernameLookup').append(this.searchBar.GetLookupErrorBadge());
                    }
                    return;
                }
                else
                {
                    await this.searchBar.SetUserDetails(imisId);
                    this.searchBar.ActivateTab(this.searchBar.UserDetailsTab);
                }
            });
        }
    }

    public isValidUrl(urlString: string): boolean
    {
        try
        {
            return Boolean(new URL(urlString));
        }
        catch (e)
        {
            return false;
        }
    }

    public Camalize(input: string): string
    {
        return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    }

    public BuildRoutesHTML(data: ConfigItem[]): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var category = item.category.length > -1 ? `<span class="searchCategory">${item.category}</span>` : '';
            var externalLinkBadge = this.isValidUrl(item.destination) ? this.assetHelper.ExternalIcon?.replace("margin-left: 6px;", "margin-left: 3px;") : '';
            var shortcut = item.isShortcut ? `<span class="searchDestination">~${item.destination}</span>` : '';
            result = result.concat(`
                <li data-index="${i}" class="commandBarListItem" name="commandBar" id="commandBar${i}">
                    <a href="${item.destination}" style="color: #222; text-decoration: none;">
                        ${category}
                        <span class="searchDisplayName">${item.displayName}</span>
                        ${externalLinkBadge}
                        ${shortcut}
                    </a>
                </li>
            `);
        });
        return result;
    }

    public BuildTagsHTML(data: ConfigItem[], seed: number, userInput: string): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var counter = seed + i;
            var id = this.Camalize(item.category);
            var destination = id == "eventCodeLookup" || id == "usernameLookup" ? '' : `href="${item.destination}${userInput}" `;
            var category = item.category.length > -1 ? `<span class="searchCategory">${item.category}</span>` : '';
            var externalLinkBadge = this.isValidUrl(item.destination) ? this.assetHelper.ExternalIcon?.replace("margin-left: 6px;", "margin-left: 3px;") : '';
            result = result.concat(`
                <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                    <a id="${id}" ${destination}style="color: #222; text-decoration: none;">
                        ${category}
                        <span class="searchDisplayName">${userInput}</span>
                        ${externalLinkBadge}
                    </a>
                </li>
            `);
        });
        return result;
    }
}
