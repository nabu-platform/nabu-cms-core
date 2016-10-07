create table roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	pseudo boolean not null
);
create table languages (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null
);
create table external_id_types (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null
);
create table components (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null
);
create table audit_states (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null
);
create table attachment_groups (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null
);
create table nodes (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	owner_id uuid references nodes(id),
	published timestamp,
	verified timestamp,
	enabled boolean not null,
	parent_id uuid references nodes(id),
	version integer not null,
	priority integer not null,
	name text,
	title text,
	description text,
	path text not null,
	slug text,
	language_id uuid references languages(id),
	component_id uuid references components(id) not null
);
create table translations (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	context text,
	name text not null,
	translation text not null,
	language_id uuid references languages(id) not null
);
create table groups (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	owner_id uuid references nodes(id)
);
create table users (
	id uuid references nodes(id) primary key,
	created timestamp not null,
	modified timestamp not null,
	secret text,
	password text,
	salt text,
	password_modified timestamp,
	secret_modified timestamp,
	alias text not null,
	verification_code text,
	invites_left integer,
	blocked_since timestamp,
	anonymous boolean not null,
	language_id uuid references languages(id)
);
create table component_actions (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	component_id uuid references components(id) not null
);
create table node_external_ids (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	external_id text not null,
	node_id uuid references nodes(id) not null,
	external_id_type_id uuid references external_id_types(id) not null
);
create table user_devices (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	allowed boolean not null,
	device_id text not null,
	name text not null,
	user_agent text,
	verification_code text,
	user_id uuid references users(id) not null
);
create table node_attachments (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	parent_id uuid references node_attachments(id),
	type text not null,
	sub_type text not null,
	size bigint not null,
	width decimal,
	height decimal,
	title text,
	description text,
	name text not null,
	uri text not null,
	node_id uuid references nodes(id) not null,
	attachment_group_id uuid references attachment_groups(id) not null
);
create table component_action_roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	component_action_id uuid references component_actions(id) not null,
	role_id uuid references roles(id) not null
);
create table user_groups (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	user_id uuid references users(id) not null,
	group_id uuid references groups(id) not null
);
create table node_locations (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	latitude decimal not null,
	longitude decimal not null,
	street text,
	city text,
	post_code text,
	country text,
	province text,
	additional text,
	number text,
	node_id uuid references nodes(id) not null
);
create table node_audits (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	actor_id uuid references nodes(id) not null,
	description text,
	host text,
	port integer,
	device_id uuid references user_devices(id),
	node_id uuid references nodes(id) not null,
	component_action_id uuid references component_actions(id) not null,
	audit_state_id uuid references audit_states(id) not null
);
create table group_roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	group_id uuid references groups(id) not null,
	role_id uuid references roles(id) not null
);
create table node_action_roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	inherit boolean not null,
	role_id uuid references roles(id) not null,
	component_action_id uuid references component_actions(id) not null,
	node_id uuid references nodes(id) not null
);
create table user_oauth2_credentials (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	oauth2_provider text not null,
	token text not null,
	active_until timestamp not null,
	refresh_token text,
	user_id uuid references users(id) not null
);
