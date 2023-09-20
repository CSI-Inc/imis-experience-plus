class ConfigManager
{
    public static readonly ConfigPath: string = "assets/search-bar-config.json";
    public static readonly Chrome_LastUpdatedKey: string = "iep__searchbBar__lastUpdated";
    public static readonly Chrome_ConfigKey: string = "iep__searchbBar__config";

    constructor(private searchBar: SearchBar, private apiHelper: ApiHelper, private assetHelper: AssetHelper) { }

    public async CheckForConfigUpdate(): Promise<void>
    {
        console.log('CheckForConfigUpdate');
        var now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        var lastUpdated = (await chrome.storage.local.get([ConfigManager.Chrome_LastUpdatedKey])).iep__searchbBar__lastUpdated;
        console.log('lastUpdated = ', lastUpdated);
        if (lastUpdated !== undefined)
        {
            console.log('lastUpdatedKey in chrome.storage.local');
            var lastUpdatedDate = new Date(lastUpdated);
            lastUpdatedDate.setUTCHours(0, 0, 0, 0);
            if (lastUpdatedDate < now)
            {
                console.log('lastUpdatedDate < now');
                var config = await this.apiHelper.GetLatestConfigJson();
                if (config && config.length > 0)
                {
                    console.log('CheckForConfigUpdate -> GetLatestConfigJson -> config = ', config);
                    await this.SetConfig(config, now);
                    await chrome.storage.local.set({ [ConfigManager.Chrome_LastUpdatedKey]: now.toISOString()?.split('T')[0] });
                }
            }
            else
            {
                console.log('......Continue......');
            }
        }
        // first time running updater, fetch config from server and set lastUpdated to today
        else
        {
            console.log('lastUpdatedKey NOT in chrome.storage.local');
            console.log('prime chrome storage');
            var configData = await this.GetInitialConfig();
            await this.SetConfig(configData, now);
        }
    }

    public async SetConfig(data: ConfigItem[], now: Date): Promise<void>
    {
        console.log('SetConfig');
        await chrome.storage.local.set({ [ConfigManager.Chrome_ConfigKey]: data });
        await chrome.storage.local.set({ [ConfigManager.Chrome_LastUpdatedKey]: now.toISOString()?.split('T')[0] });
    }

    public async GetInitialConfig(): Promise<ConfigItem[]>
    {
        console.log('GetInitialConfig');
        var result: ConfigItem[] = [];
        var lastestData = await this.apiHelper.GetLatestConfigJson();
        if (lastestData && lastestData.length > 0)
        {
            result = lastestData;
            console.log('GetInitialConfig -> GetLatestConfigJson -> Server Data = ', result);
        }
        else
        {
            // something went wrong -> get from local
            console.log('getting initial config json from server and SERVER FAILED... getting from LOCAL...');
            var response = await fetch(chrome.runtime.getURL(ConfigManager.ConfigPath));
            result = await response.json() as ConfigItem[];
            console.log('GetInitialConfig -> GetLatestConfigJson -> Local Data = ', result);
        }
        return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    public async GetChromeConfig(): Promise<ConfigItem[]>
    {
        console.log('GetChromeConfig');
        var data = (await chrome.storage.local.get([ConfigManager.Chrome_ConfigKey])).iep__searchbBar__config as ConfigItem[];
        console.log('Chrome Data data = ', data);
        // Append baseUrls for iMIS links that have client specific urls
        if (this.searchBar.ClientContext?.baseUrl != null && this.searchBar.ClientContext.baseUrl != "/")
        {
            data.forEach(item =>
            {
                if (item.destination.length > 0 && !this.isValidUrl(item.destination))
                {
                    var base = this.searchBar.ClientContext?.baseUrl.slice(0, -1);
                    item.destination = base + item.destination;
                }
            });
        }
        return data.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    public SetEventListeners(rvToken: string, baseUrl: string, includeTags = false): void
    {
        // $('.commandBarListItem').off("mouseenter mouseleave click");
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
            // $('#eventCodeLookup').off("click");
            $('#eventCodeLookup').on("click", async () =>
            {
                $('#eventCodeLookup').append(this.searchBar.GetLoader());
                var event = await this.apiHelper.GetEvent(input, rvToken, baseUrl);
                if (event == null)
                {
                    $('#eventCodeLookup .lookupLoader').remove();
                    if ($('#eventCodeLookup .lookupErrorBadge').length === 0)
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
            // $('#usernameLookup').off("click");
            $('#usernameLookup').on("click", async () =>
            {
                $('#usernameLookup').append(this.searchBar.GetLoader());
                var imisId = await this.apiHelper.FindUserIdByName(input, rvToken, baseUrl);
                if (imisId == null)
                {
                    $('#usernameLookup .lookupLoader').remove();
                    if ($('#usernameLookup .lookupErrorBadge').length === 0)
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
            var displayNameWithBadge = this.AddVersionBadge(item.displayName);
            var category = item.category.length > -1 ? `<span class="searchCategory">${item.category}</span>` : '';
            var externalLinkBadge = this.isValidUrl(item.destination) ? this.assetHelper.ExternalIcon?.replace("margin-left: 6px;", "margin-left: 3px;") : '';
            var shortcut = item.isShortcut ? `<span class="searchDestination">~${item.destination}</span>` : '';
            result = result.concat(`
                <li data-index="${i}" class="commandBarListItem" name="commandBar" id="commandBar${i}">
                    <a href="${item.destination}" style="color: #222; text-decoration: none;">
                        ${category}
                        ${displayNameWithBadge}
                        ${externalLinkBadge}
                        ${shortcut}
                    </a>
                </li>
            `);
        });
        return result;
    }

    private AddVersionBadge(input: string): string
    {
        var displayName = `<span class="searchDisplayName">${input}</span>`;
        var oldVersion = "(2017)";
        var newVersion = "(EMS)";
        if (input.includes(oldVersion))
        {
            displayName = displayName.replace(oldVersion, '');
            return displayName + this.assetHelper.VersionBadge2017 as string;
        }
        else if (input.includes(newVersion))
        {
            displayName = displayName.replace(newVersion, '');
            return displayName + this.assetHelper.VersionBadgeEMS as string;
        }
        return displayName;
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
