alter table node_relations add constraint relation_unique unique(source_id, target_id, relation_type_id);
alter table actions add constraint action_unique unique(name, component_id);
