-- Masterdata
create table load_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar
);
create table relation_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	user_relation boolean not null
);
create table thumbnail_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	width integer,
	height integer,
	name varchar not null,
	display_name varchar
);
create table tag_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
);
create table role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	pseudo boolean not null
);
create table tag (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	parent_id uuid,
	verified boolean not null,
	tag_group_id uuid not null
);
create table attachment_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
);
create table audit_state (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
);

-- Components
create table component (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	component_template_id uuid not null,
	parent_id uuid,
	node_enricher varchar,
	component_action_id uuid not null
);
create table component_action (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	icon varchar,
	mixin varchar,
	component_id uuid not null
);
create table component_action_role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	role_id uuid not null,
	component_action_id uuid not null
);
create table component_anchor (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	main boolean not null,
	component_template_id uuid not null
);
create table component_anchor_action (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	target_anchor_id uuid,
	component_anchor_id uuid not null,
	component_action_id uuid not null
);
create table component_attachment (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	content_types varchar not null,
	max_size bigint not null,
	min_occurs integer,
	max_occurs integer,
	width integer,
	height integer,
	component_id uuid not null,
	attachment_group_id uuid not null
);
create table component_attachment_thumbnail (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	component_attachment_id uuid not null,
	thumbnail_type_id uuid not null
);
create table component_child (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	min_occurs integer,
	max_occurs integer,
	child_template_id uuid,
	parent_anchor_id uuid not null,
	parent_id uuid not null,
	child_id uuid not null,
	create_action_id uuid,
	load_type_id uuid not null
);
create table component_configuration (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	key varchar not null,
	value varchar not null,
	frontend boolean not null,
	component_id uuid not null
);
create table component_key (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	key varchar not null,
	role_id uuid,
	data_type varchar,
	component_id uuid not null
);
create table component_relation_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	component_id uuid not null,
	relation_type_id uuid not null
);
create table component_tag_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	min_occurs integer,
	max_occurs integer,
	component_id uuid not null,
	tag_group_id uuid not null,
	default_tag_id uuid
);
create table component_template (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	description varchar,
	component_id uuid not null
);

-- Nodes
create table node (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	owner_id uuid not null,
	published_utc timestamp not null,
	verified boolean not null,
	enabled boolean not null,
	parent_id uuid,
	name varchar,
	title varchar,
	description varchar,
	comment varchar,
	version integer not null,
	context varchar,
	latitude decimal,
	longitude decimal,
	language varchar,
	assigned_role_id uuid,
	priority integer not null,
	component_id uuid not null
);
create table node_action_role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	role_id uuid not null,
	action_id uuid not null,
	inherit boolean,
	node_id uuid
);
create table node_attachment (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	uri varchar not null,
	name varchar not null,
	content_type varchar not null,
	size bigint not null,
	attachment_group_id uuid not null,
	verified boolean not null,
	node_id uuid not null
);
create table node_attachment_thumbnail (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	thumbnail_type_id uuid not null,
	uri varchar not null,
	size bigint not null,
	content_type varchar not null,
	node_attachment_id uuid not null
);
create table node_audit (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	actor_id uuid not null,
	action_id uuid not null,
	description varchar,
	node_id uuid not null,
	audit_state_id uuid not null
);
create table node_relation (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	verified boolean not null,
	source_id uuid not null,
	target_id uuid not null,
	relation_type_id uuid not null
);
create table node_tag (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	node_id uuid not null,
	tag_id uuid not null
);
create table node_value (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	value varchar not null,
	node_id uuid not null,
	component_key_id uuid not null
);
