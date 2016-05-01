create table component (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	view varchar not null,
	default_target varchar,
	component_action_id uuid not null
);

create table component_action (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	icon varchar,
	anchor_id uuid,
	target_id uuid,
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
	component_id uuid not null
);

create table component_attachment (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	content_types varchar not null,
	max_size bigint not null,
	min_occurs integer,
	max_occurs integer,
	role_id uuid,
	component_id uuid not null
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
	parent_template_id uuid,
	parent_anchor_id uuid,
	parent_id uuid not null,
	child_id uuid not null,
	component_action_id uuid not null,
	component_load_type_id uuid not null
);

create table component_key (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	key varchar not null,
	role_id uuid,
	component_id uuid not null
);


create table component_load_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar
);


create table component_relation_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	role_id uuid,
	component_id uuid not null,
	relation_type_id uuid not null
);

create table component_tag_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	min_occurs integer,
	max_occurs integer,
	role_id uuid,
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

create table connection_status (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
);

create table connection_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
);

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
	component_id uuid not null
);

create table node_attachment (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	uri null not null,
	name varchar not null,
	content_type varchar not null,
	size bigint not null,
	context varchar,
	parent_id uuid,
	thumbnail_type_id uuid,
	node_id uuid not null
);

create table node_audit (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	actor_id uuid not null,
	action_id uuid not null,
	log varchar,
	error varchar,
	node_id uuid not null
);

create table node_connection (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	source_id uuid not null,
	target_id uuid not null,
	connection_status_id uuid not null,
	connection_type_id uuid not null
);

create table node_relation (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
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

create table relation_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	display_name varchar,
	user_relation boolean not null
);

create table role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	pseudo boolean not null
);

create table role_permission (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	role_id uuid not null,
	action_id uuid not null,
	inherit boolean,
	node_id uuid
);

create table tag (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null,
	parent_id uuid,
	verified_utc timestamp,
	tag_group_id uuid not null
);

create table tag_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name varchar not null
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