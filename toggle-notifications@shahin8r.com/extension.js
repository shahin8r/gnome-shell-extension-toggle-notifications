const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;

let text, button, enabledIcon, disabledIcon, notificationSettings;

function _toggleStatus() {
  return notificationSettings.get_boolean('show-banners');
}

function _toggleNotifications() {
  if (notificationSettings.is_writable('show-banners')) {
    if (_toggleStatus()) {
      notificationSettings.set_boolean('show-banners', false);
      button.set_child(disabledIcon);
    } else {
      notificationSettings.set_boolean('show-banners', true);
      button.set_child(enabledIcon);
    }
  } else {
    throw 'Could not set the show-banners key.';
  }
}

function init(extensionMeta) {
    button = new St.Bin({
      style_class: 'panel-button',
      reactive: true,
      can_focus: true,
      x_fill: true,
      y_fill: false,
      track_hover: true
    });

    const theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + '/icons');

    enabledIcon = new St.Icon({ icon_name: 'toggle-notifications-enabled-symbolic', style_class: 'system-status-icon' });
    disabledIcon = new St.Icon({ icon_name: 'toggle-notifications-disabled-symbolic', style_class: 'system-status-icon' });

    notificationSettings = new Gio.Settings({ schema: 'org.gnome.desktop.notifications'});

    button.connect('button-press-event', _toggleNotifications);
}

function enable() {
    if (_toggleStatus()) {
      button.set_child(enabledIcon);
    } else {
      button.set_child(disabledIcon);
    }

    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
