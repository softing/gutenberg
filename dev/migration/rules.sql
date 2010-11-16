﻿DELETE FROM rules;

-------------------------------------------------------------------------------------------------
-- Domain
-------------------------------------------------------------------------------------------------

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('2fde426b-ed30-4376-9a7b-25278e8f104a', 'domain', 'login', 'allowed', 10, 'Can log in to the program', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('6406ad57-c889-47c5-acc6-0cd552e9cf5e', 'domain', 'configuration', 'view', 20, 'Can view the configuration', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('e55d9548-36fe-4e51-bec2-663235b5383e', 'domain', 'departments', 'manage', 30, 'Can manage departments', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('32e0bb97-2bae-4ce8-865e-cdf0edb3fd93', 'domain', 'employees', 'manage', 40, 'Can manage employees', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('2a3cae11-23ea-41c3-bdb8-d3dfdc0d486a', 'domain', 'editions', 'manage', 50, 'Can manage editions', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('086993e0-56aa-441f-8eaf-437c1c5c9691', 'domain', 'exchange', 'manage', 60, 'Can manage the exchange', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('9d057494-c2c6-41f5-9276-74b33b55c6e3', 'domain', 'roles', 'manage', 70, 'Can manage roles', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('aa4e74ad-116e-4bb2-a910-899c4f288f40', 'domain', 'readiness', 'manage', 80, 'Can manage the readiness', 'key', '');

-------------------------------------------------------------------------------------------------
-- Documents
-------------------------------------------------------------------------------------------------

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('ac0a0d95-c4d3-4bd7-93c3-cc0fc230936f', 'catalog', 'documents', 'view', 10, 'Can view materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('ee992171-d275-4d24-8def-7ff02adec408', 'catalog', 'documents', 'create', 20, 'Can create materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('6033984a-a762-4392-b086-a8d2cdac4221', 'catalog', 'documents', 'assign', 30, 'Can assign the editor', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('3040f8e1-051c-4876-8e8e-0ca4910e7e45', 'catalog', 'documents', 'delete', 40, 'Can delete materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('beba3e8d-86e5-4e98-b3eb-368da28dba5f', 'catalog', 'documents', 'recover', 50, 'Can recover materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('5b27108a-2108-4846-a0a8-3c369f873590', 'catalog', 'profile', 'edit', 60, 'Can edit the profile', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('bff78ebf-2cba-466e-9e3c-89f13a0882fc', 'catalog', 'files', 'work', 70, 'Can work with files', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('f4ad42ed-b46b-4b4e-859f-1b69b918a64a', 'catalog', 'files', 'add', 80, 'Can add files', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('fe9cd446-2f4b-4844-9b91-5092c0cabece', 'catalog', 'files', 'delete', 90, 'Can delete files', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('d782679e-3f0a-4499-bda6-8c2600a3e761', 'catalog', 'documents', 'capture', 100, 'Can capture materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('b946bd84-93fc-4a70-b325-d23c2804b2e9', 'catalog', 'documents', 'transfer', 110, 'Can transfer materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('b7adafe9-2d5b-44f3-aa87-681fd48466fa', 'catalog', 'documents', 'move', 120, 'Can move materials', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('6d590a90-58a1-447f-b5ad-e3c62f80a2ef', 'catalog', 'documents', 'briefcase', 130, 'Can put in a briefcase', 'key', '');


-------------------------------------------------------------------------------------------------
-- Editions
-------------------------------------------------------------------------------------------------

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('76323a53-1c22-4ff4-8f19-5e43d5aa0bd4', 'editions', 'calendar', 'view', 10, 'Can view calendar', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('0eecba74-ca40-4b8d-a710-03382483b0f4', 'editions', 'calendar', 'manage', 10, 'Can manage the calendar', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('2d34dbb9-db14-4fe8-a2c8-9a57e328b0b5', 'editions', 'layouts', 'view', 20, 'Can view layouts', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('ed9580be-1f36-45d1-9b60-36a2a85e5589', 'editions', 'layouts', 'manage', 20, 'Can manage layouts', 'key', '');

INSERT INTO rules(id, section, subsection, term, sortorder, title, icon, description)
VALUES ('133743df-52ab-4277-b320-3ede5222cb12', 'editions', 'documents', 'work', 30, 'Can work with documents', 'key', '');

-- To control an exchange
-- Управлять обменом

-- To assign materials
-- Назначать материалы

-- To view advertizing
-- Просматривать рекламу

-- To control requests
-- Управлять заявками

-- To control breadboard models
-- Управлять макетами

-- To control advertisers
-- Управлять рекламодателями

-- To state requests
-- Утверждать заявки

-- To state breadboard models
-- Утверждать макеты