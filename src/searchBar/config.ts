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

    public BuildRoutesHTML(data: ConfigItem[]): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var content = `
                <li data-index="${i}" class="commandBarListItem" name="commandBar" id="commandBar${i}">
                    <a href="${item.destination}" style="color: #222; text-decoration: none;">
                        ${item.category.length > -1 ?
                    `<span style="border: 1px solid lightgray; border-radius: 3px; float: left; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; min-width: 90px; text-align: center;">
                                ${item.category}
                            </span>`
                    : ''}
                        ${item.displayName}
                        ${item.isShortcut ?
                    `<span style="border: 1px solid lightgray; border-radius: 3px; float: right; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px;">
                            ~${item.destination}
                        </span>`
                    : ''}
                    </a>
                </li>
                `;
            result = result.concat(content);
        });
        return result;
    }

    public BuildTagsHTML(data: ConfigItem[], seed: number, userInput: string): string
    {
        var result = '';
        data.forEach((item, i) =>
        {
            var content = '';
            var counter = seed + i;
            switch (item.category.toLowerCase())
            {
                case "event code lookup":
                    // different id so that Config.SetEventListeners can setup specific functions for events and username
                    content = `
                    <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                        <a id="eventCodeLookup" style="color: #222; text-decoration: none;">
                            ${item.category.length > -1 ? `<span>${item.category}</span>` : ''}
                            ${userInput}
                        </a>
                    </li>
                    `;
                    break;
                case "username lookup":
                    content = `
                    <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                        <a id="usernameLookup" style="color: #222; text-decoration: none;">
                            ${item.category.length > -1 ? `<span>${item.category}</span>` : ''}
                            ${userInput}
                        </a>
                    </li>
                    `;
                    break;
                case "documentation lookup":
                    content = `
                    <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                        <a href="${item.destination}${userInput}" style="color: #222; text-decoration: none;">
                            ${item.category.length > -1 ? `<span>${item.category}${this.assetHelper.ExternalIcon}</span>` : ''}
                            ${userInput}
                        </a>
                    </li>
                    `;
                    break;
                case "keyword search":
                    content = `
                    <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                        <a href="${item.destination}${userInput}" style="color: #222; text-decoration: none;">
                            ${item.category.length > -1 ? `<span>${item.category}</span>` : ''}
                            ${userInput}
                        </a>
                    </li>
                    `;
                    break;
                case "imis glossary":
                    content = `
                    <li data-index="${counter}" class="commandBarListItem" name="commandBar" id="commandBar${counter}">
                        <a href="${item.destination}" style="color: #222; text-decoration: none; vertical-align: middle;">
                            ${item.category.length > -1 ? `<span>${item.category}${this.assetHelper.ExternalIcon}</span>` : ''}
                        </a>
                    </li>
                    `;
                default:
                    break;
            }
            result = result.concat(content);
        });
        return result;
    }
}
