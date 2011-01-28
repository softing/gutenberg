-- Install Rss Plugin

DELETE FROM plugins.menu   WHERE plugin='rss';
DELETE FROM plugins.routes WHERE plugin='rss';
DELETE FROM plugins.rules  WHERE plugin='rss';
DELETE FROM plugins.l18n   WHERE plugin='rss';

-- Insert Menu items

INSERT INTO plugins.menu(plugin, menu_section, menu_id, menu_sortorder, menu_enabled)
    VALUES ('rss', 'documents', 'plugin-rss', 100, true);
INSERT INTO plugins.menu(plugin, menu_section, menu_id, menu_sortorder, menu_enabled)
    VALUES ('rss', 'settings', 'plugin-rss-control', 100, true);

-- Insert public Routes

INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/feeds/', 'plugins-rss', 'feeds', null, true, false);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/feeds/:feed', 'plugins-rss', 'feed', null, true, false);

-- Insert manage Routes

INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/list/', 'plugins-rss-manage', 'list', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/read/', 'plugins-rss-manage', 'read', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/update/', 'plugins-rss-manage', 'update', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/publish/', 'plugins-rss-manage', 'publish', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/unpublish/', 'plugins-rss-manage', 'unpublish', null, true, true);

-- Insert files manage Routes

INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/files/list/', 'plugins-rss-files', 'list', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/files/upload/', 'plugins-rss-files', 'upload', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/files/publish/', 'plugins-rss-files', 'publish', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/files/unpublish/', 'plugins-rss-files', 'unpublish', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/files/delete/', 'plugins-rss-files', 'delete', null, true, true);

-- Insert settings Routes

INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/create/', 'plugins-rss-control', 'create', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/read/', 'plugins-rss-control', 'read', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/update/', 'plugins-rss-control', 'update', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/delete/', 'plugins-rss-control', 'delete', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/list/', 'plugins-rss-control', 'list', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/tree/', 'plugins-rss-control', 'tree', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/save/', 'plugins-rss-control', 'save', null, true, true);
INSERT INTO plugins.routes(plugin, route_url, route_controller, route_action, route_name, route_enabled, route_authentication)
    VALUES ('rss', '/rss/control/fill/', 'plugins-rss-control', 'fill', null, true, true);

-- Insert Rules

INSERT INTO plugins.rules(id, plugin, rule_section, rule_subsection, rule_term, rule_sortorder, rule_title, rule_icon, rule_description, rule_enabled)
    VALUES ('b98fb3fd-2593-44c8-bcd8-12da48693ef7', 'rss', 'catalog', 'documents', 'rss', 150, 'Can manage rss', 'key', '', true);

-- RU Locale

UPDATE plugins.rules SET rule_sortorder=150, rule_title = 'Может редактировать RSS' WHERE id = 'b98fb3fd-2593-44c8-bcd8-12da48693ef7';

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'RSS feeds', 'RSS ленты');

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'Publish', 'Опубликовать');

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'Unpublish', 'Снять с публикации');

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'Show only with RSS', 'Показывать только с RSS');

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'Feeds', 'Ленты');

INSERT INTO plugins.l18n (plugin, l18n_language, l18n_original, l18n_translation)
    VALUES ('rss', 'ru', 'Default feed', 'Лента по умолчанию');