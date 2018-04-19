alter table node_relations add column started timestamp;
alter table node_relations add column stopped timestamp;

alter table master_data_categories add column owner_id uuid references nodes(id);
alter table master_data_categories add column description text;

alter table master_data_entries add column owner_id uuid references nodes(id);
alter table master_data_entries add column description text;

alter table components add column owner_id uuid references nodes(id);
alter table components add column description text;

alter table actions add column owner_id uuid references nodes(id);
alter table actions add column description text;

alter table node_tags add column owner_id uuid references nodes(id);

alter table node_ratings add column owner_id uuid references nodes(id) not null;