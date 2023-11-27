class ConfigManager
{
    public static readonly ConfigPath: string = "assets/search-bar-config.json";
    public static readonly Chrome_LastUpdatedKey: string = "iep__searchbBar__lastUpdated";
    public static readonly Chrome_ConfigKey: string = "iep__searchbBar__config";

    constructor(private searchBar: WorkBar, private apiHelper: ApiHelper, private assetHelper: AssetHelper) { }

    public async checkForConfigUpdate(): Promise<void>
    {
        var now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        var lastUpdated = (await chrome.storage.local.get([ConfigManager.Chrome_LastUpdatedKey]))[ConfigManager.Chrome_LastUpdatedKey];
        Utils.log('lastUpdated = ', lastUpdated);
        if (lastUpdated !== undefined)
        {
            Utils.log('lastUpdatedKey in chrome.storage.local');
            var lastUpdatedDate = new Date(lastUpdated);
            lastUpdatedDate.setUTCHours(0, 0, 0, 0);
            if (lastUpdatedDate < now)
            {
                Utils.log('lastUpdatedDate < now');
                var config = await this.apiHelper.getLatestConfigJson();
                if (config && config.length > 0)
                {
                    Utils.log('CheckForConfigUpdate -> GetLatestConfigJson -> config = ', config);
                    await this.setConfig(config, now);
                    await chrome.storage.local.set({ [ConfigManager.Chrome_LastUpdatedKey]: now.toISOString()?.split('T')[0] });
                }
            }

        }
        // first time running updater, fetch config and set lastUpdated to today
        else
        {
            Utils.log('lastUpdatedKey NOT in chrome.storage.local');
            var configData = await this.getInitialConfig();
            await this.setConfig(configData, now);
        }
    }

    public async setConfig(data: ConfigItem[], now: Date): Promise<void>
    {
        Utils.log('SetConfig');
        await chrome.storage.local.set({ [ConfigManager.Chrome_ConfigKey]: data });
        await chrome.storage.local.set({ [ConfigManager.Chrome_LastUpdatedKey]: now.toISOString()?.split('T')[0] });
    }

    public async getInitialConfig(): Promise<ConfigItem[]>
    {
        Utils.log('GetInitialConfig');
        var result: ConfigItem[] = [];
        var lastestData = await this.apiHelper.getLatestConfigJson();
        if (lastestData && lastestData.length > 0)
        {
            result = lastestData;
            Utils.log('GetInitialConfig -> GetLatestConfigJson -> Server Data = ', result);
        }
        else
        {
            // something went wrong -> get from local
            var response = await fetch(chrome.runtime.getURL(ConfigManager.ConfigPath));
            result = await response.json() as ConfigItem[];
            Utils.log('GetInitialConfig -> GetLatestConfigJson -> Local Data = ', result);
        }
        return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    public async getChromeConfig(): Promise<ConfigItem[]>
    {
        Utils.log('GetChromeConfig');
        var data = (await chrome.storage.local.get([ConfigManager.Chrome_ConfigKey])).iep__searchbBar__config as ConfigItem[];
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

    public setEventListeners(rvToken: string, baseUrl: string, includeTags = false): void
    {
        // $('.commandBarListItem').off("mouseenter mouseleave click");
        $('.commandBarListItem')
            .on("mouseenter", e => $(e.currentTarget).addClass('commandBarHover'))
            .on("mouseleave", e => $(e.currentTarget).removeClass('commandBarHover'))
            .on('click', e =>
            {
                var anchorId = $(e.currentTarget).find('a').attr('id');
                if (anchorId != "usernameLookup" && anchorId != "eventCodeLookup"
                    && $(e.currentTarget).find('.lookupLoader').length == 0)
                {
                    $(e.currentTarget).find('a').append(this.searchBar.getLoader());
                }
            });

        if (includeTags)
        {
            var input = $('#commandBarInput').val() as string;

            $('#eventCodeLookup').on("click", async () =>
            {
                $('#eventCodeLookup').append(this.searchBar.getLoader());
                var event = await this.apiHelper.getEvent(input, rvToken, baseUrl);
                if (event == null)
                {
                    $('#eventCodeLookup .lookupLoader').remove();
                    if ($('#eventCodeLookup .lookupErrorBadge').length === 0)
                    {
                        $('#eventCodeLookup').append(this.searchBar.getLookupErrorBadge());
                    }
                    return;
                }
                else
                {
                    await this.searchBar.setEventDetails(event);
                    this.searchBar.activateTab(this.searchBar.EventDetailsTab);
                }
            });

            $('#usernameLookup').on("click", async () =>
            {
                $('#usernameLookup').append(this.searchBar.getLoader());
                var imisId = await this.apiHelper.findUserIdByName(input, rvToken, baseUrl);
                if (imisId == null)
                {
                    $('#usernameLookup .lookupLoader').remove();
                    if ($('#usernameLookup .lookupErrorBadge').length === 0)
                    {
                        $('#usernameLookup').append(this.searchBar.getLookupErrorBadge());
                    }
                    return;
                }
                else
                {
                    await this.searchBar.setUserDetails(imisId);
                    this.searchBar.activateTab(this.searchBar.UserDetailsTab);
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

    public convertToCamelCase(input: string): string
    {
        return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    }

    public buildRoutesHtml(data: ConfigItem[]): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var displayNameWithBadge = this.addVersionBadge(item.displayName);
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

    private addVersionBadge(input: string): string
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

    public buildTagsHtml(data: ConfigItem[], seed: number, userInput: string): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var counter = seed + i;
            var id = this.convertToCamelCase(item.category);
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