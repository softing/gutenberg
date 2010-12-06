DELETE FROM ad_advertisers;
DELETE FROM ad_modules;
DELETE FROM ad_places;
DELETE FROM ad_requests;
DELETE FROM branches;
DELETE FROM cache_access;
DELETE FROM cache_visibility;
DELETE FROM catalog;
DELETE FROM documents;
DELETE FROM editions;
DELETE FROM fascicles;
DELETE FROM fascicles_index;
DELETE FROM fascicles_map_documents;
DELETE FROM fascicles_map_holes;
DELETE FROM fascicles_pages;
DELETE FROM history;
DELETE FROM index;
DELETE FROM index_mapping;
DELETE FROM logs;
DELETE FROM map_member_to_catalog;
DELETE FROM map_member_to_rule;
DELETE FROM map_principals_to_stages;
DELETE FROM map_role_to_rule;
DELETE FROM members;
DELETE FROM migration;
DELETE FROM options;
DELETE FROM profiles;
DELETE FROM readiness;
DELETE FROM roles;
DELETE FROM sessions;
DELETE FROM stages;
DELETE FROM state;

INSERT INTO members(id, "login", "password", created, updated)
	VALUES ('39d40812-fc54-4342-9b98-e1c1f4222d22','root','d3abe2a5e34f48d6e362606ca044f06e7fb77adb920a4b1a6845601b48443222', now(), now());

INSERT INTO map_member_to_catalog(id, member, catalog)
    VALUES ('c293a89e-e044-41e6-a267-dbefba39a450', '39d40812-fc54-4342-9b98-e1c1f4222d22', '00000000-0000-0000-0000-000000000000');

INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('2f96242b-5c76-4418-afcb-4b2e75f95b48', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '6406ad57-c889-47c5-acc6-0cd552e9cf5e');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('8c0bf266-a93d-4a46-930a-0c6ec558fa75', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '32e0bb97-2bae-4ce8-865e-cdf0edb3fd93');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('10f41d8a-46a5-4f2d-824d-321243b92bc0', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '086993e0-56aa-441f-8eaf-437c1c5c9691');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('1c6d1f3d-c4ad-4a2a-95d8-f0bb4637cc31', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', 'e55d9548-36fe-4e51-bec2-663235b5383e');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('b1421263-33cb-4b0a-a19c-c8706ef4db29', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '2a3cae11-23ea-41c3-bdb8-d3dfdc0d486a');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('1697b7ce-aa5b-4719-9acf-687f4d6ebb1e', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '2fde426b-ed30-4376-9a7b-25278e8f104a');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('2b50ec94-3936-4e2b-801a-129724c2bbe4', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', 'aa4e74ad-116e-4bb2-a910-899c4f288f40');
INSERT INTO map_member_to_rule(id, member, section, area, binding, term)
    VALUES ('72b48332-3ac3-4bed-bb51-34636d8eb47b', '39d40812-fc54-4342-9b98-e1c1f4222d22', 'domain', 'domain', '00000000-0000-0000-0000-000000000000', '9d057494-c2c6-41f5-9276-74b33b55c6e3');