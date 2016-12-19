alter table node_relations add constraint relation_unique unique(source_id, target_id, relation_type_id);
alter table actions add constraint action_unique unique(name, component_id);
alter table user_oauth2_credentials add constraint oauth2_unique unique(web_application, oauth2_provider, user_id);

-- this does not work!
--alter table users add constraint alias_lower_unique unique(lower(alias));

create unique index alias_unique on users (lower(alias), realm);

