class SearchBar
{
    private static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    public static CommandBar: string = chrome.runtime.getURL("assets/components/test.html");
    public static ShiftButtonBadge: string = chrome.runtime.getURL("assets/components/shiftButtonBadge.html");
    public static async GetResource(url: string): Promise<string>
    {
        return await $.get(url);
    }

    constructor(private $: JQueryStatic)
    {
        // Run some checks to determine if we are inside of the iMIS staff site
        if (this.$('head').get(0)?.id !== 'ctl00_Head1' && this.$('form').get(0)?.id !== 'aspnetForm')
        {
            // Not iMIS - do nothing
            return;
        }

        // Initialize the module
        this.init();
    }

    /**
     * Initializes the various elements of this module.
     */
    init(): void
    {
        console.log(SearchBar.VERSION_STRING + "Loaded: Work Bar", ...SearchBar.VERSION_STYLES);
        
        let keysPressed: { [key: string]: boolean } = {};
        document.addEventListener('keydown', (event) =>
        {
            keysPressed[event.key] = true;
            console.log(event.key);
            if (keysPressed['Shift'] && event.key == 'W')
            {
                this.showOverlay();
            }
        });

        document.addEventListener('keyup', (event) =>
        {
            delete keysPressed[event.key];
        });
    }

    async showOverlay(): Promise<void>
    {
        $('body').prepend(await SearchBar.GetResource(SearchBar.CommandBar));
        $('#commandBarInput').trigger("focus");

        // TODO: Remove - this is for testing
        var resource = await SearchBar.GetResource(SearchBar.ShiftButtonBadge);
        console.log("resource", resource);
        $('body').prepend(resource);
    }


    // showStuff(stuff: string): void
    // {
    //     let output: string = `
    //         <div class="card">
    //             <span class="card--id">#${stuff}</span>
    //         </div>
    //     `
    //     // this.container.innerHTML += output
    // }

    // imgModal(src: string): void
    // {
    //     const modal = document.createElement("div");
    //     modal.setAttribute("class", "modal");
    //     //add the modal to the main section or the parent element
    //     document.querySelector(".main")?.append(modal);
    //     //adding image to modal
    //     const newImage = document.createElement("img");
    //     newImage.setAttribute("src", src);
    //     modal.append(newImage);
    // };
}

new SearchBar(jQuery);