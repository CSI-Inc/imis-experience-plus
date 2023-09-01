/// <reference path="settingsModel.ts" />

class Settings
{
    public static readonly SPACEBAR = 'Spacebar';

    constructor(private $: JQueryStatic)
    {
        // Contains interactive logic for the popout menu speceifically. Will early exit for other pages.
        this.$(async () =>
        {
            if (!$('#iep-menu').length)
            {
                return;
            }

            var config = await this.load();

            // Restore settings to the page
            $('#enable-iqa').prop('checked', config.enableIqa);
            $('#enable-rise').prop('checked', config.enableRise);
            $('#enable-workbar').prop('checked', config.enableWorkbar);
            $('#workbar-kbd').val(config.workbarShortcut);
            $('#kbd-ctrl').prop('checked', config.workbarKbdCtrl);
            $('#kbd-alt').prop('checked', config.workbarKbdAlt);
            $('#kbd-shift').prop('checked', config.workbarKbdShift);

            $('#workbar-kbd').on('keydown', (e) =>
            {
                e.preventDefault();

                if (e.metaKey || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift')
                {
                    return;
                }

                $('#kbd-ctrl').prop('checked', e.ctrlKey);
                $('#kbd-alt').prop('checked', e.altKey);
                $('#kbd-shift').prop('checked', e.shiftKey);

                // Capitalize the first letter of e.key
                e.key = e.key.charAt(0).toUpperCase() + e.key.slice(1);

                // Rename ' ' to Space
                if (e.key === ' ') e.key = Settings.SPACEBAR;

                // If the user enters backspace, clear the input
                if (e.key === 'Backspace')
                {
                    $('#workbar-kbd').val('');
                }
                else
                {
                    $('#workbar-kbd').val(e.key);
                }

                this.save();
            });

            // If any input on the page changes or any key is pressed, save the settings
            $('input').on('change', () => this.save());
        });
    }

    public save(): void
    {
        chrome.storage.sync.set(<SettingsModel>{
            enableIqa: $('#enable-iqa').prop('checked'),
            enableRise: $('#enable-rise').prop('checked'),
            enableWorkbar: $('#enable-workbar').prop('checked'),
            workbarShortcut: $('#workbar-kbd').val(),
            workbarKbdCtrl: $('#kbd-ctrl').prop('checked'),
            workbarKbdAlt: $('#kbd-alt').prop('checked'),
            workbarKbdShift: $('#kbd-shift').prop('checked')
        });
    }

    public async load(something?: string): Promise<SettingsModel>
    {
        return new Promise<SettingsModel>((resolve) =>
        {
            chrome.storage.sync.get(<SettingsModel>{
                enableIqa: true,
                enableRise: false,
                enableWorkbar: true,
                workbarShortcut: Settings.SPACEBAR,
                workbarKbdCtrl: true,
                workbarKbdAlt: false,
                workbarKbdShift: false
            }, (settings) =>
            {
                resolve(<SettingsModel>{
                    enableIqa: settings.enableIqa,
                    enableRise: settings.enableRise,
                    enableWorkbar: settings.enableWorkbar,
                    workbarShortcut: settings.workbarShortcut,
                    workbarKbdCtrl: settings.workbarKbdCtrl,
                    workbarKbdAlt: settings.workbarKbdAlt,
                    workbarKbdShift: settings.workbarKbdShift
                });
            });
        });
    }
}

new Settings(jQuery);