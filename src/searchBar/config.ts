class ConfigManager
{
    private static readonly ConfigPath: string = "assets/search-bar-config.json";

    constructor(private searchBar: SearchBar, private apiHelper: ApiHelper, private assetHelper: AssetHelper) { }

    public static async GetConfigInstance(): Promise<ConfigItem[]>
    {
        var url = chrome.runtime.getURL(this.ConfigPath);

        var configItems = (await fetch(url).then(data => data.json()) as ConfigItem[])
            .sort((a, b) => a.displayName.localeCompare(b.displayName));

        return configItems;
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
                console.log('anchorId = ', anchorId);
                if (anchorId == "usernameLookup" || anchorId == "eventCodeLookup")
                {
                    // this is to prevent event conflict with "eventCodeLookup" & "usernameLookup" on click listeners
                } else
                {
                    this.searchBar.ActivateTab('');
                }
            });

        if (includeTags)
        {
            var input = $('#commandBarInput').val() as string;
            $('#eventCodeLookup').on("click", async () =>
            {
                var event = await this.apiHelper.GetEvent(input, rvToken, baseUrl);
                console.log('event = ', event);
                if (event === null) return;
                this.searchBar.ActivateTab('');
                await this.searchBar.SetEventDetails(event);
                this.searchBar.ActivateTab(this.searchBar.EventDetailsTab);
            });
            $('#usernameLookup').on("click", async () =>
            {
                var imisId = await this.apiHelper.FindUserIdByName(input, rvToken, baseUrl);
                console.log('imisId = ', imisId);
                if (imisId === null) return;
                this.searchBar.ActivateTab('');
                await this.searchBar.SetUserDetails(imisId);
                this.searchBar.ActivateTab(this.searchBar.UserDetailsTab);
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

    public BuildRoutesHTML(data: ConfigItem[]): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var category = item.category.length > -1 ? `<span class="searchCategory">${item.category} ${this.isValidUrl(item.destination) ? this.assetHelper.ExternalIcon : ''}</span>` : '';
            var shortcut = item.isShortcut ? `<span class="searchDestination">~${item.destination}</span>` : '';
            var content = `
                <li data-index="${i}" class="commandBarListItem" name="commandBar" id="commandBar${i}">
                    <a href="${item.destination}" style="color: #222; text-decoration: none;">
                        ${category}
                        ${item.displayName}
                        ${shortcut}
                    </a>
                </li>
                `;
            result = result.concat(content);
        });
        return result;
    }

    public Camalize(input: string): string
    {
        return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    }

    public BuildTagsHTML(data: ConfigItem[], seed: number, userInput: string): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var counter = seed + i;
            var id = this.Camalize(item.category);
            var destination = id == "eventCodeLookup" || id == "usernameLookup" ? undefined : `href="${item.destination}${userInput}"`;
            var category = item.category.length > -1 ? `<span class="searchCategory">${item.category} ${this.isValidUrl(item.destination) ? this.assetHelper.ExternalIcon : ''}</span>` : '';
            result.concat(`
                <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                    <a id="${id}" ${destination} style="color: #222; text-decoration: none;">
                        ${category}
                        ${userInput}
                    </a>
                </li>
            `);
        });
        return result;
    }
}
