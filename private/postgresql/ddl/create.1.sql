alter table node_relations add constraint relation_unique unique(source_id, target_id, relation_type_id);
alter table actions add constraint action_unique unique(name, component_id);
alter table user_oauth2_credentials add constraint oauth2_unique unique(web_application, oauth2_provider, user_id, resource);

-- this does not work!
--alter table users add constraint alias_lower_unique unique(lower(alias));

create unique index alias_unique on users (lower(alias), realm);

-- make sure tags can only be set once on a node
alter table node_tags add constraint tag_unique unique(node_id, definition_id);

-- make sure translations are unique
alter table translations add constraint translation_unique unique(context, name, language_id);

-- make sure categories and entries are unique
alter table master_data_categories add constraint master_data_category_unique unique(name, owner_id);
alter table master_data_entries add constraint master_data_entry_unique unique(name, master_data_category_id, owner_id);